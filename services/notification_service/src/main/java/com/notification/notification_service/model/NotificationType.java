package com.notification.notification_service.model;

/**
 * Enum for different types of notifications
 */
public enum NotificationType {
    ORDER_PLACED,
    ORDER_CONFIRMED,
    ORDER_PREPARED,
    ORDER_READY,
    ORDER_DELIVERED,
    ORDER_CANCELLED,
    PAYMENT_SUCCESSFUL,
    PAYMENT_FAILED,
    ACCOUNT_CREATED,
    ACCOUNT_UPDATED,
    DELIVERY_ASSIGNED,
    DELIVERY_STARTED,
    PROMOTION,
    SYSTEM
}