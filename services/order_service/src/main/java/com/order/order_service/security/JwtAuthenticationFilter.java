package com.order.order_service.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Arrays;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

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
        
        try {
            // Check if we're using Gateway authentication
            if (gatewayAuthEnabled) {
                handleGatewayAuthentication(request);
            } else {
                // Traditional JWT token authentication
                handleJwtAuthentication(request);
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e.getMessage());
        }
        
        filterChain.doFilter(request, response);
    }
    
    private void handleGatewayAuthentication(HttpServletRequest request) {
        // Get user information from Gateway-provided headers
        String userId = request.getHeader(gatewayUserHeader);
        String roles = request.getHeader(gatewayRoleHeader);
        
        if (StringUtils.hasText(userId)) {
            logger.debug("Found user ID in gateway header: {}", userId);
            
            List<SimpleGrantedAuthority> authorities = Collections.emptyList();
            if (StringUtils.hasText(roles)) {
                authorities = Arrays.stream(roles.split(","))
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                    .collect(Collectors.toList());
            }
            
            // Create authentication - we trust the Gateway has already authenticated the user
            UserDetails userDetails = new User(userId, "", authorities);
            
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            
            // Set authentication to Security Context
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // Set userId as request attribute to be accessed in controllers
            request.setAttribute("userId", Long.parseLong(userId));
        }
    }
    
    private void handleJwtAuthentication(HttpServletRequest request) {
        // Get JWT token from request
        String token = getTokenFromRequest(request);
        
        // Validate token
        if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {
            // Get username and userId from token
            String username = jwtTokenProvider.getUsernameFromToken(token);
            String userId = jwtTokenProvider.getUserIdFromToken(token);
            
            logger.debug("Valid JWT token found. Username: {}, UserID: {}", username, userId);
            
            if (username != null) {
                // Create authentication
                UserDetails userDetails = new User(
                        username, "", Collections.emptyList());
                
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // Set authentication to Security Context
                SecurityContextHolder.getContext().setAuthentication(authentication);
                
                // Set userId as request attribute to be accessed in controllers
                if (userId != null) {
                    request.setAttribute("userId", Long.parseLong(userId));
                }
            }
        } else if (token != null) {
            logger.debug("Invalid JWT token: {}", token);
        }
    }
    
    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            //return bearerToken.substring(7);
            return null;
        }
        return null;
    }
}