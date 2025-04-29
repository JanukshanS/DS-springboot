package com.payment.payment_service.model.dto;

import com.payment.payment_service.model.PaymentMethod;
import com.payment.payment_service.model.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    
    private Long id;
    private Long orderId;
    private BigDecimal amount;
    private PaymentStatus status;
    private PaymentMethod paymentMethod;
    private String transactionId;
    private String clientSecret;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}