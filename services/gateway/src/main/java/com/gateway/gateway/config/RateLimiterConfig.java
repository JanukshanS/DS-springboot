package com.gateway.gateway.config;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

@Configuration
public class RateLimiterConfig {

    @Bean
    public KeyResolver userKeyResolver() {
        return exchange -> {
            // Use the user ID if available, otherwise use the request IP
            String userId = exchange.getRequest().getHeaders().getFirst("X-User-ID");
            if (userId != null && !userId.isEmpty()) {
                return Mono.just(userId);
            }
            
            String ip = exchange.getRequest().getRemoteAddress().getAddress().getHostAddress();
            return Mono.just(ip);
        };
    }
    
    @Bean
    public RedisRateLimiter redisRateLimiter() {
        // Allow 10 requests per second with a burst of 20 requests
        return new RedisRateLimiter(10, 20);
    }
}