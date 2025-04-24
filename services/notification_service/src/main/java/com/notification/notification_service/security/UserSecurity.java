package com.notification.notification_service.security;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * UserDetails implementation to represent an authenticated user
 * This is a simplified version for the notification service, which only needs
 * the username from the JWT token
 */
public class UserSecurity implements UserDetails {
    private static final long serialVersionUID = 1L;

    private String username;
    
    @JsonIgnore
    private String password;

    private Collection<? extends GrantedAuthority> authorities;

    public UserSecurity(String username, Collection<? extends GrantedAuthority> authorities) {
        this.username = username;
        this.password = ""; // Not used in this service
        this.authorities = authorities;
    }

    /**
     * Build a UserSecurity object with the given username
     * @param username the username from the JWT token
     * @return UserSecurity object
     */
    public static UserSecurity build(String username) {
        // Since we only need basic authentication and not complex roles for this service,
        // we'll assign a default USER role
        Collection<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
        return new UserSecurity(username, authorities);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}