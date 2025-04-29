package com.payment.payment_service.service.impl;

import com.payment.payment_service.exception.PaymentException;
import com.payment.payment_service.model.Payment;
import com.payment.payment_service.model.PaymentMethod;
import com.payment.payment_service.model.PaymentStatus;
import com.payment.payment_service.model.dto.PaymentRequest;
import com.payment.payment_service.model.dto.PaymentResponse;
import com.payment.payment_service.repository.PaymentRepository;
import com.payment.payment_service.service.PaymentService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.RefundCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    
    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    @Override
    @Transactional
    public PaymentResponse createPayment(PaymentRequest paymentRequest, String userId) {
        log.info("Creating payment for order ID: {} by user: {}", paymentRequest.getOrderId(), userId);
        
        try {
            // Create a Stripe PaymentIntent
            PaymentIntentCreateParams.Builder paramsBuilder = PaymentIntentCreateParams.builder()
                    .setAmount(paymentRequest.getAmount().multiply(java.math.BigDecimal.valueOf(100)).longValue()) // Convert to cents
                    .setCurrency("usd")
                    .setDescription("Payment for Order #" + paymentRequest.getOrderId())
                    .setReceiptEmail(paymentRequest.getUserEmail()); // Using userId as email for simplicity
            
            // Add metadata
            java.util.Map<String, String> metadata = new java.util.HashMap<>();
            metadata.put("orderId", paymentRequest.getOrderId().toString());
            metadata.put("userId", userId);
            paramsBuilder.putAllMetadata(metadata);
            
            PaymentIntentCreateParams params = paramsBuilder.build();
            PaymentIntent paymentIntent = PaymentIntent.create(params);
            
            // Create a payment record in our database
            Payment payment = Payment.builder()
                    .orderId(paymentRequest.getOrderId())
                    .userId(userId)
                    .amount(paymentRequest.getAmount())
                    .status(PaymentStatus.PENDING)
                    .paymentMethod(paymentRequest.getPaymentMethod())
                    .transactionId(UUID.randomUUID().toString())
                    .stripePaymentIntentId(paymentIntent.getId())
                    .build();
            
            payment = paymentRepository.save(payment);
            
            // Return the payment details and client secret for frontend processing
            return PaymentResponse.builder()
                    .id(payment.getId())
                    .orderId(payment.getOrderId())
                    .amount(payment.getAmount())
                    .status(payment.getStatus())
                    .paymentMethod(payment.getPaymentMethod())
                    .transactionId(payment.getTransactionId())
                    .clientSecret(paymentIntent.getClientSecret())
                    .createdAt(payment.getCreatedAt())
                    .updatedAt(payment.getUpdatedAt())
                    .build();
        } catch (StripeException e) {
            log.error("Error creating payment with Stripe: {}", e.getMessage());
            throw new PaymentException("Failed to process payment: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new PaymentException("Payment not found with ID: " + id));
        
        return mapToPaymentResponse(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByUserId(String userId) {
        List<Payment> payments = paymentRepository.findByUserId(userId);
        return payments.stream()
                .map(this::mapToPaymentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByOrderId(Long orderId) {
        List<Payment> payments = paymentRepository.findByOrderId(orderId);
        return payments.stream()
                .map(this::mapToPaymentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PaymentResponse updatePaymentStatus(Long id, PaymentStatus status) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new PaymentException("Payment not found with ID: " + id));
        
        payment.setStatus(status);
        payment.setUpdatedAt(LocalDateTime.now());
        payment = paymentRepository.save(payment);
        
        return mapToPaymentResponse(payment);
    }

    @Override
    @Transactional
    public PaymentResponse processStripeWebhook(String payload, String signature) {
        try {
            Event event = Webhook.constructEvent(payload, signature, webhookSecret);
            EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
            
            if (!dataObjectDeserializer.getObject().isPresent()) {
                throw new PaymentException("Webhook data object could not be deserialized");
            }
            
            switch (event.getType()) {
                case "payment_intent.succeeded":
                    PaymentIntent paymentIntent = (PaymentIntent) dataObjectDeserializer.getObject().get();
                    return handlePaymentIntentSucceeded(paymentIntent);
                case "payment_intent.payment_failed":
                    paymentIntent = (PaymentIntent) dataObjectDeserializer.getObject().get();
                    return handlePaymentIntentFailed(paymentIntent);
                default:
                    log.info("Unhandled event type: {}", event.getType());
                    return null;
            }
        } catch (SignatureVerificationException e) {
            log.error("Invalid signature in Stripe webhook: {}", e.getMessage());
            throw new PaymentException("Invalid Stripe webhook signature");
        } catch (Exception e) {
            log.error("Error processing Stripe webhook: {}", e.getMessage());
            throw new PaymentException("Error processing Stripe webhook: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public PaymentResponse refundPayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new PaymentException("Payment not found with ID: " + id));
        
        if (payment.getStatus() != PaymentStatus.COMPLETED) {
            throw new PaymentException("Only completed payments can be refunded");
        }
        
        try {
            RefundCreateParams params = RefundCreateParams.builder()
                    .setPaymentIntent(payment.getStripePaymentIntentId())
                    .build();
            
            Refund refund = Refund.create(params);
            
            if ("succeeded".equals(refund.getStatus())) {
                payment.setStatus(PaymentStatus.REFUNDED);
                payment.setUpdatedAt(LocalDateTime.now());
                payment = paymentRepository.save(payment);
            }
            
            return mapToPaymentResponse(payment);
        } catch (StripeException e) {
            log.error("Error refunding payment: {}", e.getMessage());
            throw new PaymentException("Failed to refund payment: " + e.getMessage());
        }
    }
    
    private PaymentResponse mapToPaymentResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrderId())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .paymentMethod(payment.getPaymentMethod())
                .transactionId(payment.getTransactionId())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
    
    private PaymentResponse handlePaymentIntentSucceeded(PaymentIntent paymentIntent) {
        Payment payment = paymentRepository.findByStripePaymentIntentId(paymentIntent.getId())
                .orElseThrow(() -> new PaymentException("Payment not found for PaymentIntent: " + paymentIntent.getId()));
        
        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setUpdatedAt(LocalDateTime.now());
        payment = paymentRepository.save(payment);
        
        log.info("Payment completed successfully for order: {}", payment.getOrderId());
        
        return mapToPaymentResponse(payment);
    }
    
    private PaymentResponse handlePaymentIntentFailed(PaymentIntent paymentIntent) {
        Payment payment = paymentRepository.findByStripePaymentIntentId(paymentIntent.getId())
                .orElseThrow(() -> new PaymentException("Payment not found for PaymentIntent: " + paymentIntent.getId()));
        
        payment.setStatus(PaymentStatus.FAILED);
        payment.setUpdatedAt(LocalDateTime.now());
        payment = paymentRepository.save(payment);
        
        log.error("Payment failed for order: {}", payment.getOrderId());
        
        return mapToPaymentResponse(payment);
    }
}