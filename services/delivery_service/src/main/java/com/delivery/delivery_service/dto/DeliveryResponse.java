package com.delivery.delivery_service.dto;

import com.delivery.delivery_service.model.DeliveryStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryResponse {
    
    private Long id;
    private Long orderId;
    private Long driverId;
    private String driverName;
    private String driverPhone;
    private String customerName;
    private String customerPhone;
    private String deliveryAddress;
    private String restaurantName;
    private String restaurantAddress;
    private DeliveryStatus status;
    private LocalDateTime assignedAt;
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;
    private Double pickupLatitude;
    private Double pickupLongitude;
    private Double deliveryLatitude;
    private Double deliveryLongitude;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}