package com.payment.payment_service.service;

import com.payment.payment_service.model.Payment;
import com.payment.payment_service.model.PaymentStatus;
import com.payment.payment_service.model.dto.PaymentRequest;
import com.payment.payment_service.model.dto.PaymentResponse;

import java.util.List;

public interface PaymentService {
    
    PaymentResponse createPayment(PaymentRequest paymentRequest, String userId);
    
    PaymentResponse getPaymentById(Long id);
    
    List<PaymentResponse> getPaymentsByUserId(String userId);
    
    List<PaymentResponse> getPaymentsByOrderId(Long orderId);
    
    PaymentResponse updatePaymentStatus(Long id, PaymentStatus status);
    
    PaymentResponse processStripeWebhook(String payload, String signature);
    
    PaymentResponse refundPayment(Long id);
}