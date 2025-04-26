package com.order.order_service.model;

public enum OrderStatus {
    PENDING,
    CONFIRMED, 
    PREPARING,
    READY_FOR_PICKUP,
    OUT_FOR_DELIVERY,
    DELIVERED,
    CANCELLED,
    REFUNDED
}