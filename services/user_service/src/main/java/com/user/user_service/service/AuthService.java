package com.user.user_service.service;

import com.user.user_service.dto.JwtResponse;
import com.user.user_service.dto.LoginRequest;
import com.user.user_service.dto.SignupRequest;
import com.user.user_service.model.User;
import com.user.user_service.repository.UserRepository;
import com.user.user_service.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service for authentication operations
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    /**
     * Register a new user
     * @param signupRequest registration information
     * @return true if registration is successful
     */
    public User registerUser(SignupRequest signupRequest) {
        // Check if username is already taken
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        // Check if email is already in use
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        // Create new user's account
        User user = new User();
        user.setUsername(signupRequest.getUsername());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setFullName(signupRequest.getFullName());
        user.setPhoneNumber(signupRequest.getPhoneNumber());
        user.setRole(signupRequest.getRole());
        user.setAddress(signupRequest.getAddress());
        
        // Set role-specific fields
        user.setAvailable(signupRequest.isAvailable());
        user.setCurrentLocation(signupRequest.getCurrentLocation());
        user.setRestaurantId(signupRequest.getRestaurantId());

        return userRepository.save(user);
    }

    /**
     * Authenticate a user and generate JWT token
     * @param loginRequest login credentials
     * @return JWT token response
     */
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found!"));
        
        return new JwtResponse(
                jwt,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        );
    }
}