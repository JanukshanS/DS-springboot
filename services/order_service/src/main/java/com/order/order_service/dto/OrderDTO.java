package com.order.order_service.dto;

import com.order.order_service.model.OrderStatus;
import com.order.order_service.model.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    private Long id;
    private Long userId;
    private Long restaurantId;
    private OrderStatus status;
    private LocalDateTime orderTime;
    private LocalDateTime deliveryTime;
    private BigDecimal totalAmount;
    private String deliveryAddress;
    private String specialInstructions;
    private List<OrderItemDTO> orderItems;
    private Long deliveryPersonnelId;
    private Boolean isPaid;
    private String paymentId;
    private PaymentMethod paymentMethod;
}