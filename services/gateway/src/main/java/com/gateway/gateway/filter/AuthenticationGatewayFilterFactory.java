package com.gateway.gateway.filter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationGatewayFilterFactory extends AbstractGatewayFilterFactory<AuthenticationGatewayFilterFactory.Config> {

    @Autowired
    private AuthenticationFilter authenticationFilter;

    public AuthenticationGatewayFilterFactory() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return authenticationFilter;
    }

    public static class Config {
        // Configuration properties can be added here if needed
    }
}