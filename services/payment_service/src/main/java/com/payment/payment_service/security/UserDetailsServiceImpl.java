package com.payment.payment_service.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@Slf4j
public class UserDetailsServiceImpl implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // In a microservice architecture, this would typically call the user service
        // or validate the token against an authentication server.
        // For our payment service, we'll use a simplified approach and trust the JWT validation.
        
        log.info("Loading user by username: {}", username);
        
        // Return a minimal UserDetails with the username from the JWT
        // The actual roles would come from the JWT claims in a complete implementation
        return new User(
                username,
                "", // Empty password since authentication is done via JWT
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }
}