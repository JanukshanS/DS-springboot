package com.payment.payment_service.controller;

import com.payment.payment_service.model.PaymentStatus;
import com.payment.payment_service.model.dto.PaymentRequest;
import com.payment.payment_service.model.dto.PaymentResponse;
import com.payment.payment_service.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Create a new payment
     * @param paymentRequest the payment request containing user details
     * @return the created payment response
     */
    @PostMapping("/create")
    public ResponseEntity<PaymentResponse> createPayment(@Valid @RequestBody PaymentRequest paymentRequest) {
        // Retrieve userId directly from the paymentRequest instead of the SecurityContext
        String userId = paymentRequest.getUserId(); // Now using userId from JSON body
        log.info("Creating payment for order ID: {} by user: {}", paymentRequest.getOrderId(), userId);
        PaymentResponse response = paymentService.createPayment(paymentRequest, userId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Get payment by payment ID
     * @param id the payment ID
     * @return the payment response
     */
    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable Long id) {
        log.info("Fetching payment with ID: {}", id);
        PaymentResponse response = paymentService.getPaymentById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Get payments for the current user
     * @param paymentRequest the payment request containing userId
     * @return list of payments for the user
     */
    @GetMapping("/user")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByCurrentUser(@RequestBody PaymentRequest paymentRequest) {
        // Retrieve userId from the request body
        String userId = paymentRequest.getUserId(); // Get userId from the JSON body
        log.info("Fetching payments for user: {}", userId);
        List<PaymentResponse> responses = paymentService.getPaymentsByUserId(userId);
        return ResponseEntity.ok(responses);
    }

    /**
     * Get payments by order ID
     * @param orderId the order ID
     * @return list of payments for the order
     */
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByOrderId(@PathVariable Long orderId) {
        log.info("Fetching payments for order ID: {}", orderId);
        List<PaymentResponse> responses = paymentService.getPaymentsByOrderId(orderId);
        return ResponseEntity.ok(responses);
    }

    /**
     * Update payment status
     * @param id the payment ID
     * @param status the new payment status
     * @return the updated payment
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<PaymentResponse> updatePaymentStatus(
            @PathVariable Long id,
            @RequestParam PaymentStatus status) {
        log.info("Updating payment ID: {} with status: {}", id, status);
        PaymentResponse response = paymentService.updatePaymentStatus(id, status);
        return ResponseEntity.ok(response);
    }

    /**
     * Refund a payment
     * @param id the payment ID
     * @return the refunded payment
     */
    @PostMapping("/{id}/refund")
    public ResponseEntity<PaymentResponse> refundPayment(@PathVariable Long id) {
        log.info("Refunding payment with ID: {}", id);
        PaymentResponse response = paymentService.refundPayment(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Handle Stripe webhook
     * @param payload the webhook payload
     * @param signature the webhook signature
     * @return success response
     */
    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String signature) {
        log.info("Received Stripe webhook");
        paymentService.processStripeWebhook(payload, signature);
        return ResponseEntity.ok("Webhook processed successfully");
    }
}
