package com.user.user_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for health check and service monitoring
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    /**
     * Simple health check endpoint
     * @return service status
     */
    @GetMapping
    public ResponseEntity<?> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("service", "user-service");
        response.put("status", "up");
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }
}