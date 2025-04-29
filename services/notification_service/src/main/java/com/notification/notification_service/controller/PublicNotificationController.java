package com.notification.notification_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.notification.notification_service.dto.NotificationRequest;
import com.notification.notification_service.dto.NotificationResponse;
import com.notification.notification_service.service.NotificationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Controller for public notification endpoints accessible by other services
 * without authentication
 */
@RestController
@RequestMapping("/api/public/notifications")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Public Notification API", description = "Public endpoints for service-to-service notification operations")
public class PublicNotificationController {
    
    private final NotificationService notificationService;
    
    /**
     * Create a new notification from another service
     * @param request the notification request
     * @return the created notification
     */
    @PostMapping("/createNew")
    @Operation(summary = "Create a new notification", description = "Creates a new notification for a user (service-to-service API)")
    public ResponseEntity<NotificationResponse> createNotification(@Valid @RequestBody NotificationRequest request) {
        log.info("Public API: Creating notification with request: {}", request);
        NotificationResponse response = notificationService.createNotification(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}