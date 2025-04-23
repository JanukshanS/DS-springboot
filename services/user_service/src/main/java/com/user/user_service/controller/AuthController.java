package com.user.user_service.controller;

import com.user.user_service.dto.JwtResponse;
import com.user.user_service.dto.LoginRequest;
import com.user.user_service.dto.SignupRequest;
import com.user.user_service.dto.UserResponse;
import com.user.user_service.model.User;
import com.user.user_service.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for handling authentication requests
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Register a new user
     * @param signupRequest registration information
     * @return response with success message
     */
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        User user = authService.registerUser(signupRequest);
        return ResponseEntity.ok(UserResponse.fromUser(user));
    }

    /**
     * Authenticate a user
     * @param loginRequest login credentials
     * @return JWT token response
     */
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(jwtResponse);
    }
}
