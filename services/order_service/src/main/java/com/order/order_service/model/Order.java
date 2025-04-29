package com.order.order_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "orders")
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long userId;
    
    private Long restaurantId;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    
    private LocalDateTime orderTime;
    
    private LocalDateTime deliveryTime;
    
    private BigDecimal totalAmount;
    
    private String deliveryAddress;
    
    private String specialInstructions;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems;
    
    // For delivery tracking
    private Long deliveryPersonnelId;
    
    // Payment information
    private Boolean isPaid = false;
    private String paymentId;
    
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;
}