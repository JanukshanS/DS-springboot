package com.delivery.delivery_service.model;

/**
 * Enumeration of user roles in the food delivery platform
 */
public enum Role {
    CUSTOMER,       // Regular users who order food
    RESTAURANT_ADMIN, // Restaurant administrators who manage restaurant profiles
    DELIVERY_PERSONNEL, // Delivery staff who handle food deliveries
    SYSTEM_ADMIN    // System administrators with full access
}