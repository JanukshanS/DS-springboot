package com.gateway.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {
    // Remove the corsWebFilter bean or keep it commented if you want to retain for reference
    /*
    @Bean
    public CorsWebFilter corsWebFilter() {
        // ... existing configuration
    }
    */
}
