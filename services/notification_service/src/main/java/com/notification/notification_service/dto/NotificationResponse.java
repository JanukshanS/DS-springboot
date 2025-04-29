package com.notification.notification_service.dto;

import java.time.LocalDateTime;

import com.notification.notification_service.model.NotificationType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for notification responses
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private String userId;
    private String title;
    private String message;
    private NotificationType type;
    private boolean read;
    private LocalDateTime createdAt;
    private String resourceId;
    private String additionalData;
}