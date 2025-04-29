package com.delivery.delivery_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries_new")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Delivery {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long orderId;
    
    @Column(nullable = false)
    private Long driverId;
    
    private String driverName;
    
    private String driverPhone;
    
    @Column(nullable = false)
    private String customerName;
    
    @Column(nullable = false)
    private String customerPhone;
    
    @Column(nullable = false)
    private String deliveryAddress;
    
    private String restaurantName;
    
    private String restaurantAddress;
    
    @Enumerated(EnumType.STRING)
    private DeliveryStatus status;
    
    private LocalDateTime assignedAt;
    
    private LocalDateTime pickedUpAt;
    
    private LocalDateTime deliveredAt;
    
    private Double pickupLatitude;
    
    private Double pickupLongitude;
    
    private Double deliveryLatitude;
    
    private Double deliveryLongitude;
    
    private String notes;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = DeliveryStatus.PENDING;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}