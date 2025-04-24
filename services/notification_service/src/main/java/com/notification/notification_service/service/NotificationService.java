package com.notification.notification_service.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.notification.notification_service.dto.NotificationRequest;
import com.notification.notification_service.dto.NotificationResponse;
import com.notification.notification_service.exception.ResourceNotFoundException;
import com.notification.notification_service.model.Notification;
import com.notification.notification_service.model.NotificationType;
import com.notification.notification_service.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for notification operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final EmailService emailService;
    
    /**
     * Create a new notification
     * @param request the notification request
     * @return the created notification
     */
    @Transactional
    public NotificationResponse createNotification(NotificationRequest request) {
        log.info("Creating notification for user: {}", request.getUserId());
        
        Notification notification = Notification.builder()
                .userId(request.getUserId())
                .title(request.getTitle())
                .message(request.getMessage())
                .type(request.getType())
                .resourceId(request.getResourceId())
                .additionalData(request.getAdditionalData())
                .build();
        
        notification = notificationRepository.save(notification);
        
        // Send email notification if requested
        if (request.isSendEmail()) {
            try {
                emailService.sendEmailNotification(request.getUserId(), request.getTitle(), request.getMessage());
            } catch (Exception e) {
                log.error("Failed to send email notification: {}", e.getMessage());
                // Continue with the process even if email sending fails
            }
        }
        
        return mapToResponse(notification);
    }
    
    /**
     * Get all notifications for a user
     * @param userId the user ID
     * @return list of notifications for the user
     */
    public List<NotificationResponse> getUserNotifications(String userId) {
        log.info("Getting all notifications for user: {}", userId);
        
        List<Notification> notifications = notificationRepository.findByUserId(userId);
        return notifications.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get unread notifications for a user
     * @param userId the user ID
     * @return list of unread notifications for the user
     */
    public List<NotificationResponse> getUnreadNotifications(String userId) {
        log.info("Getting unread notifications for user: {}", userId);
        
        List<Notification> notifications = notificationRepository.findByUserIdAndRead(userId, false);
        return notifications.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get notifications by type for a user
     * @param userId the user ID
     * @param type the notification type
     * @return list of notifications of the specified type for the user
     */
    public List<NotificationResponse> getNotificationsByType(String userId, NotificationType type) {
        log.info("Getting notifications of type {} for user: {}", type, userId);
        
        List<Notification> notifications = notificationRepository.findByUserIdAndType(userId, type);
        return notifications.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Mark a notification as read
     * @param notificationId the notification ID
     * @param userId the user ID
     * @return the updated notification
     * @throws ResourceNotFoundException if notification is not found or doesn't belong to the user
     */
    @Transactional
    public NotificationResponse markAsRead(Long notificationId, String userId) {
        log.info("Marking notification {} as read for user: {}", notificationId, userId);
        
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));
        
        if (!notification.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Notification not found for user: " + userId);
        }
        
        notification.setRead(true);
        notification = notificationRepository.save(notification);
        return mapToResponse(notification);
    }
    
    /**
     * Mark all notifications as read for a user
     * @param userId the user ID
     */
    @Transactional
    public void markAllAsRead(String userId) {
        log.info("Marking all notifications as read for user: {}", userId);
        
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndRead(userId, false);
        unreadNotifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }
    
    /**
     * Get the count of unread notifications for a user
     * @param userId the user ID
     * @return count of unread notifications
     */
    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndRead(userId, false);
    }
    
    /**
     * Map a notification entity to a response DTO
     * @param notification the notification entity
     * @return the notification response DTO
     */
    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .userId(notification.getUserId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .resourceId(notification.getResourceId())
                .additionalData(notification.getAdditionalData())
                .build();
    }
}