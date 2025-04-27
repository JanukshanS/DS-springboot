package com.user.user_service.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.user.user_service.model.User;
import com.user.user_service.repository.UserRepository;

/**
 * Component to handle user-specific security checks
 */
@Component("userSecurity")
public class UserSecurity {

    @Autowired
    private UserRepository userRepository;
    
    /**
     * Check if the current authenticated user is the user with the given ID
     * @param userId the user ID to check
     * @return true if the current user matches the given ID
     */
    public boolean isCurrentUser(Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }
        
        Object principal = authentication.getPrincipal();
        
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            User user = userRepository.findByUsername(username).orElse(null);
            return user != null && user.getId().equals(userId);
        }
        
        return false;
    }
}