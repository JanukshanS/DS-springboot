package com.gateway.gateway.filter;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;
import java.util.function.Predicate;

@Component
public class RouterValidator {

    // List of endpoints that don't require authentication
    public static final List<String> openApiEndpoints = List.of(
            "/api/auth/login",
            "/api/auth/register",
            "/api/restaurants",
            "/api/restaurants/",
            "/api/restaurants/all",
            "/api/restaurants/search",
            "/api/restaurants/cuisines",
            "/api/menu-items",
            "/api/menu-items/",
            "/api/orders",
            "/api/notifications",
            "/api/payments",
            "/api/deliveries"
    );

    // Predicate to check if the request should be authenticated
    public Predicate<ServerHttpRequest> isSecured =
            request -> openApiEndpoints
                    .stream()
                    .noneMatch(uri -> request.getURI().getPath().startsWith(uri));
}