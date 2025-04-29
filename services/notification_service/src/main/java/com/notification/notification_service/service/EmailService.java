package com.notification.notification_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for sending email notifications
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    private final JavaMailSender emailSender;
    
    /**
     * Send an email notification to a user
     * @param userId the user ID
     * @param subject the email subject
     * @param text the email body
     * @throws Exception if email sending fails
     */
    public void sendEmailNotification(String userId, String subject, String text) throws Exception {
        log.info("Sending email notification to user: {}", userId);
        
        // In a real application, you would use the userId to fetch the user's email from the User Service
        // For demo purposes, we'll assume the userId is the email address
        String to = userId;
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        
        try {
            emailSender.send(message);
            log.info("Email notification sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email notification: {}", e.getMessage());
            throw e;
        }
    }
}