package com.gateway.gateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @GetMapping("/user")
    public Mono<ResponseEntity<Map<String, String>>> userServiceFallback() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "error");
        response.put("message", "User Service is currently unavailable. Please try again later.");
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }
    
    @GetMapping("/restaurant")
    public Mono<ResponseEntity<Map<String, String>>> restaurantServiceFallback() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "error");
        response.put("message", "Restaurant Service is currently unavailable. Please try again later.");
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }
    
    @GetMapping("/order")
    public Mono<ResponseEntity<Map<String, String>>> orderServiceFallback() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "error");
        response.put("message", "Order Service is currently unavailable. Please try again later.");
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }
    
    @GetMapping("/payment")
    public Mono<ResponseEntity<Map<String, String>>> paymentServiceFallback() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "error");
        response.put("message", "Payment Service is currently unavailable. Please try again later.");
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }
    
    @GetMapping("/delivery")
    public Mono<ResponseEntity<Map<String, String>>> deliveryServiceFallback() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "error");
        response.put("message", "Delivery Service is currently unavailable. Please try again later.");
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }
    
    @GetMapping("/notification")
    public Mono<ResponseEntity<Map<String, String>>> notificationServiceFallback() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "error");
        response.put("message", "Notification Service is currently unavailable. Please try again later.");
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }
    
    @GetMapping("/default")
    public Mono<ResponseEntity<Map<String, String>>> defaultFallback() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "error");
        response.put("message", "The service is currently unavailable. Please try again later.");
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }
}