package com.restaurant.restaurant_service.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    
    @Value("${auth.gateway.enabled:false}")
    private boolean gatewayAuthEnabled;
    
    @Value("${auth.gateway.header:X-User-ID}")
    private String gatewayUserHeader;
    
    @Value("${auth.gateway.role-header:X-User-Roles}")
    private String gatewayRoleHeader;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // Check if we're using Gateway authentication
        if (gatewayAuthEnabled) {
            handleGatewayAuthentication(request);
        } else {
            // Traditional JWT token authentication
            handleJwtAuthentication(request);
        }
        
        filterChain.doFilter(request, response);
    }
    
    private void handleGatewayAuthentication(HttpServletRequest request) {
        // Get user information from Gateway-provided headers
        String userId = request.getHeader(gatewayUserHeader);
        String roles = request.getHeader(gatewayRoleHeader);
        
        if (StringUtils.hasText(userId)) {
            // Create authentication - we trust the Gateway has already authenticated the user
            UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                    userId, "", Collections.emptyList());
            
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            
            // Set authentication to Security Context
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
    }
    
    private void handleJwtAuthentication(HttpServletRequest request) {
        // Get JWT token from request
        String token = getTokenFromRequest(request);
        
        // Validate token
        if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {
            // Get username from token
            String username = jwtTokenProvider.getUsernameFromToken(token);
            
            // Create authentication
            UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                    username, "", Collections.emptyList());
            
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            
            // Set authentication to Security Context
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
    }
    
    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}