package com.notification.notification_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

/**
 * Controller for health check endpoints
 */
@RestController
@RequestMapping("/health")
@Slf4j
@Tag(name = "Health Controller", description = "Endpoints for service health monitoring")
public class HealthController {
    
    /**
     * Simple health check endpoint
     * @return success response
     */
    @GetMapping
    @Operation(summary = "Health check", description = "Checks if the service is up and running")
    public ResponseEntity<String> healthCheck() {
        log.info("Health check requested");
        return ResponseEntity.ok("Notification service is running");
    }
}