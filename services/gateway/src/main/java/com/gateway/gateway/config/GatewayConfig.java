package com.gateway.gateway.config;

import com.gateway.gateway.filter.AuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Autowired
    private AuthenticationFilter authenticationFilter;

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                // User Service Routes - Allow public access to login/register
                .route("user-service", r -> r.path("/api/auth/**", "/api/users/**")
                        .filters(f -> f.circuitBreaker(c -> c.setName("userCircuitBreaker")
                                .setFallbackUri("forward:/fallback/user")))
                        .uri("http://localhost:8081"))
                
                // Restaurant Service Routes - Public endpoints
                .route("restaurant-service-public", r -> r.path("/api/restaurants", "/api/restaurants/", 
                                                              "/api/restaurants/all", "/api/restaurants/search",
                                                              "/api/restaurants/cuisines", "/api/menu-items", 
                                                              "/api/menu-items/")
                        .filters(f -> f.circuitBreaker(c -> c.setName("restaurantPublicCircuitBreaker")
                                .setFallbackUri("forward:/fallback/restaurant")))
                        .uri("http://localhost:8082"))
                
                // Restaurant Service Routes - Protected endpoints
                .route("restaurant-service-protected", r -> r.path("/api/restaurants/**", "/api/menu-items/**", "/api/reviews/**")
                        .filters(f -> f.filter(authenticationFilter)
                                .circuitBreaker(c -> c.setName("restaurantProtectedCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/restaurant")))
                        .uri("http://localhost:8082"))
                
                // Order Service Routes - All require authentication
                .route("order-service", r -> r.path("/api/orders/**")
                        .filters(f -> f.filter(authenticationFilter)
                                .circuitBreaker(c -> c.setName("orderCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/order")))
                        .uri("http://localhost:8083"))
                
                // Payment Service Routes - All require authentication
                .route("payment-service", r -> r.path("/api/payments/**")
                        .filters(f -> f.filter(authenticationFilter)
                                .circuitBreaker(c -> c.setName("paymentCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/payment")))
                        .uri("http://localhost:8084"))
                
                // Delivery Service Routes - All require authentication
                .route("delivery-service", r -> r.path("/api/deliveries/**")
                        .filters(f -> f.filter(authenticationFilter)
                                .circuitBreaker(c -> c.setName("deliveryCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/delivery")))
                        .uri("http://localhost:8085"))
                
                // Notification Service Routes - All require authentication
                .route("notification-service", r -> r.path("/api/notifications/**")
                        .filters(f -> f.filter(authenticationFilter)
                                .circuitBreaker(c -> c.setName("notificationCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/notification")))
                        .uri("http://localhost:8086"))
                
                // Health check endpoint
                .route("health-check", r -> r.path("/health")
                        .uri("forward:/health"))
                
                // Fallback endpoints
                .route("fallback-endpoints", r -> r.path("/fallback/**")
                        .uri("forward:/fallback/default"))
                
                .build();
    }
}