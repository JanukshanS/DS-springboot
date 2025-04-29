package com.gateway.gateway.filter;

import com.gateway.gateway.security.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class AuthenticationFilter implements GatewayFilter {

    @Autowired
    private RouterValidator routerValidator;
    
    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        
        // Check if the request requires authentication
        if (routerValidator.isSecured.test(request)) {
            if (!request.getHeaders().containsKey("Authorization")) {
                return onError(exchange, "Authorization header is missing", HttpStatus.UNAUTHORIZED);
            }
            
            final String token = getAuthToken(request);
            
            if (token == null) {
                return onError(exchange, "Invalid authorization header format", HttpStatus.UNAUTHORIZED);
            }
            
            if (!jwtUtil.validateToken(token)) {
                return onError(exchange, "Invalid or expired JWT token", HttpStatus.UNAUTHORIZED);
            }
            
            // Get claims for header propagation
            Claims claims = jwtUtil.getAllClaimsFromToken(token);
            
            // Add user information headers for downstream services
            exchange = addAuthorizationHeaders(exchange, claims);
        }
        
        return chain.filter(exchange);
    }
    
    private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        return response.setComplete();
    }
    
    private String getAuthToken(ServerHttpRequest request) {
        String authHeader = request.getHeaders().getFirst("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
    
    private ServerWebExchange addAuthorizationHeaders(ServerWebExchange exchange, Claims claims) {
        String userId = claims.getSubject();
        
        // Get roles if available in token
        String roles = "";
        if (claims.get("roles") != null) {
            if (claims.get("roles") instanceof Iterable) {
                roles = String.join(",", (Iterable<String>) claims.get("roles"));
            } else {
                roles = claims.get("roles").toString();
            }
        }
        
        // Create a new request with added headers for downstream services
        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                .header("X-User-ID", userId)
                .header("X-User-Roles", roles)
                .build();
        
        return exchange.mutate().request(mutatedRequest).build();
    }
}