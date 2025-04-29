package com.payment.payment_service.repository;

import com.payment.payment_service.model.Payment;
import com.payment.payment_service.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    List<Payment> findByUserId(String userId);
    
    List<Payment> findByOrderId(Long orderId);
    
    Optional<Payment> findByTransactionId(String transactionId);
    
    Optional<Payment> findByStripePaymentIntentId(String paymentIntentId);
    
    List<Payment> findByStatus(PaymentStatus status);
}