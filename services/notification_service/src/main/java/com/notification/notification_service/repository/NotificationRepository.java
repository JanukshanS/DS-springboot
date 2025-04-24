package com.notification.notification_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.notification.notification_service.model.Notification;
import com.notification.notification_service.model.NotificationType;

/**
 * Repository for Notification entity
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    /**
     * Find notifications by user ID
     * @param userId the ID of the user
     * @return list of notifications for the user
     */
    List<Notification> findByUserId(String userId);
    
    /**
     * Find unread notifications by user ID
     * @param userId the ID of the user
     * @param read the read status
     * @return list of unread notifications for the user
     */
    List<Notification> findByUserIdAndRead(String userId, boolean read);
    
    /**
     * Find notifications by user ID and type
     * @param userId the ID of the user
     * @param type the notification type
     * @return list of notifications of the specified type for the user
     */
    List<Notification> findByUserIdAndType(String userId, NotificationType type);
    
    /**
     * Count unread notifications by user ID
     * @param userId the ID of the user
     * @param read the read status
     * @return count of unread notifications for the user
     */
    long countByUserIdAndRead(String userId, boolean read);
}