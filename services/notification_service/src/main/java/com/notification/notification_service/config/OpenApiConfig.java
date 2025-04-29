package com.notification.notification_service.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration for OpenAPI/Swagger documentation
 */
@Configuration
public class OpenApiConfig {

    /**
     * Configure OpenAPI documentation
     * @return OpenAPI configuration
     */
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Notification Service API")
                        .description("API for managing notifications in the food delivery application")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("Food Delivery App")
                                .url("https://fooddeliveryapp.com")
                                .email("contact@fooddeliveryapp.com"))
                        .license(new License()
                                .name("Private License")
                                .url("https://fooddeliveryapp.com/license")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication", createAPIKeyScheme()));
    }

    /**
     * Create security scheme for Swagger UI
     * @return SecurityScheme for JWT authentication
     */
    private SecurityScheme createAPIKeyScheme() {
        return new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .bearerFormat("JWT")
                .scheme("bearer");
    }
}