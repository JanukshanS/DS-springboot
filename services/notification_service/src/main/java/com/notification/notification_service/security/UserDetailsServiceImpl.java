package com.notification.notification_service.security;

import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * UserDetailsService implementation to load user details
 * For the notification service, this uses a simplified approach since
 * actual authentication happens in the user service.
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    /**
     * Load user by username from JWT token
     * Since actual authentication happens in the user service,
     * we only need to create a UserDetails object with the username
     * @param username the username from the JWT token
     * @return UserDetails object with the username
     * @throws UsernameNotFoundException if user not found
     */
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // In the notification service, we rely on the token validity
        // rather than database lookups for user authentication
        return UserSecurity.build(username);
    }
}