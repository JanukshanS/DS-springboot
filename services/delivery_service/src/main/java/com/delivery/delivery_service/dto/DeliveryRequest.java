package com.delivery.delivery_service.dto;

import com.delivery.delivery_service.model.DeliveryStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryRequest {
    
    @NotNull(message = "Order ID is required")
    private Long orderId;
    
    private Long driverId;
    
    private String driverName;
    
    private String driverPhone;
    
    @NotBlank(message = "Customer name is required")
    private String customerName;
    
    @NotBlank(message = "Customer phone is required")
    private String customerPhone;
    
    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;
    
    private String restaurantName;
    
    private String restaurantAddress;
    
    private DeliveryStatus status;
    
    private Double pickupLatitude;
    
    private Double pickupLongitude;
    
    private Double deliveryLatitude;
    
    private Double deliveryLongitude;
    
    private String notes;
}