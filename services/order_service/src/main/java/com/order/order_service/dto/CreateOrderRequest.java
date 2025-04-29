package com.order.order_service.dto;

import com.order.order_service.model.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {
    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;

    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;
    
    private String specialInstructions;
    
    @NotEmpty(message = "Order must contain at least one item")
    private List<OrderItemRequest> items;
    
    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
}