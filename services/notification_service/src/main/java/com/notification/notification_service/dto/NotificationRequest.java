package com.notification.notification_service.dto;

import com.notification.notification_service.model.NotificationType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for notification creation requests
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {
    
    @NotBlank(message = "User ID is required")
    private String userId;
    
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;
    
    @NotBlank(message = "Message is required")
    @Size(max = 1000, message = "Message cannot exceed 1000 characters")
    private String message;
    
    @NotNull(message = "Notification type is required")
    private NotificationType type;
    
    private String resourceId;
    
    private String additionalData;
    
    private boolean sendEmail;
}