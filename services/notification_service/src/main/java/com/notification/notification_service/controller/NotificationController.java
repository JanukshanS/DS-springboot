package com.notification.notification_service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.notification.notification_service.dto.NotificationRequest;
import com.notification.notification_service.dto.NotificationResponse;
import com.notification.notification_service.dto.UserIdRequest;
import com.notification.notification_service.model.NotificationType;
import com.notification.notification_service.service.NotificationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Controller for notification endpoints
 */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Notification Controller", description = "Endpoints for notification operations")
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/createForUser")
    @Operation(summary = "Create a new notification", description = "Creates a new notification for a user")
    public ResponseEntity<NotificationResponse> createNotification(@Valid @RequestBody NotificationRequest request) {
        log.info("Creating notification with request: {}", request);
        NotificationResponse response = notificationService.createNotification(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/user/all")
    @Operation(summary = "Get all notifications", description = "Returns all notifications for the given user")
    public ResponseEntity<List<NotificationResponse>> getUserNotifications(@Valid @RequestBody UserIdRequest request) {
        String userId = request.getUserId();
        log.info("Getting all notifications for user: {}", userId);
        List<NotificationResponse> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    @PostMapping("/user/unread")
    @Operation(summary = "Get unread notifications", description = "Returns unread notifications for the given user")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(@Valid @RequestBody UserIdRequest request) {
        String userId = request.getUserId();
        log.info("Getting unread notifications for user: {}", userId);
        List<NotificationResponse> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    @PostMapping("/user/unread/count")
    @Operation(summary = "Get unread notification count", description = "Returns the count of unread notifications for the given user")
    public ResponseEntity<Long> getUnreadCount(@Valid @RequestBody UserIdRequest request) {
        String userId = request.getUserId();
        log.info("Getting unread notification count for user: {}", userId);
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(count);
    }

    @PostMapping("/user/type/{type}")
    @Operation(summary = "Get notifications by type", description = "Returns notifications of a specific type for the given user")
    public ResponseEntity<List<NotificationResponse>> getNotificationsByType(
            @PathVariable NotificationType type,
            @Valid @RequestBody UserIdRequest request) {
        String userId = request.getUserId();
        log.info("Getting notifications of type {} for user: {}", type, userId);
        List<NotificationResponse> notifications = notificationService.getNotificationsByType(userId, type);
        return ResponseEntity.ok(notifications);
    }

    @PostMapping("/user/{notificationId}/read")
    @Operation(summary = "Mark notification as read", description = "Marks a specific notification as read")
    public ResponseEntity<NotificationResponse> markAsRead(
            @PathVariable Long notificationId,
            @Valid @RequestBody UserIdRequest request) {
        String userId = request.getUserId();
        log.info("Marking notification {} as read for user: {}", notificationId, userId);
        NotificationResponse notification = notificationService.markAsRead(notificationId, userId);

        if (notification == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(notification);
    }

    @PostMapping("/user/read-all")
    @Operation(summary = "Mark all notifications as read", description = "Marks all notifications as read for the given user")
    public ResponseEntity<String> markAllAsRead(@Valid @RequestBody UserIdRequest request) {
        String userId = request.getUserId();
        log.info("Marking all notifications as read for user: {}", userId);
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok("All notifications marked as read");
    }

    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Checks if the service is up and running")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Notification service is up and running");
    }
}
