package com.user.user_service.controller;

import com.user.user_service.dto.MessageResponse;
import com.user.user_service.dto.PasswordChangeRequest;
import com.user.user_service.dto.UserResponse;
import com.user.user_service.dto.UserUpdateRequest;
import com.user.user_service.model.User;
import com.user.user_service.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller for user management operations
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * Get all users (admin only)
     * @return list of all users
     */
    @GetMapping
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> userResponses = userService.getAllUsers().stream()
                .map(UserResponse::fromUser)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userResponses);
    }

    /**
     * Get user by ID
     * @param id user ID
     * @return user if found
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('SYSTEM_ADMIN') or @userSecurity.isCurrentUser(#id) or hasRole('RESTAURANT_ADMIN')")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(UserResponse.fromUser(user));
    }

    /**
     * Get current user profile
     * @return current authenticated user
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.getUserByUsername(userDetails.getUsername());
        return ResponseEntity.ok(UserResponse.fromUser(user));
    }

    /**
     * Update user information
     * @param id user ID
     * @param updateRequest updated user information
     * @return updated user
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SYSTEM_ADMIN') or @userSecurity.isCurrentUser(#id)")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id, 
            @Valid @RequestBody UserUpdateRequest updateRequest) {
        User updatedUser = userService.updateUser(id, updateRequest);
        return ResponseEntity.ok(UserResponse.fromUser(updatedUser));
    }

    /**
     * Delete a user
     * @param id user ID
     * @return success message
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SYSTEM_ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().body("User deleted successfully");
    }
    
    /**
     * Get all delivery personnel
     * @return list of delivery personnel
     */
    @GetMapping("/delivery-personnel")
    @PreAuthorize("hasRole('SYSTEM_ADMIN') or hasRole('RESTAURANT_ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllDeliveryPersonnel() {
        List<UserResponse> deliveryPersonnel = userService.getAllDeliveryPersonnel().stream()
                .map(UserResponse::fromUser)
                .collect(Collectors.toList());
        return ResponseEntity.ok(deliveryPersonnel);
    }
    
    /**
     * Get all available delivery personnel
     * @return list of available delivery personnel
     */
    @GetMapping("/delivery-personnel/available")
    @PreAuthorize("hasRole('SYSTEM_ADMIN') or hasRole('RESTAURANT_ADMIN')")
    public ResponseEntity<List<UserResponse>> getAvailableDeliveryPersonnel() {
        List<UserResponse> availableDeliveryPersonnel = userService.getAvailableDeliveryPersonnel().stream()
                .map(UserResponse::fromUser)
                .collect(Collectors.toList());
        return ResponseEntity.ok(availableDeliveryPersonnel);
    }
    
    /**
     * Update delivery personnel availability
     * @param id user ID
     * @param available availability status
     * @return updated user
     */
    @PutMapping("/delivery-personnel/{id}/availability")
    @PreAuthorize("hasRole('SYSTEM_ADMIN') or @userSecurity.isCurrentUser(#id)")
    public ResponseEntity<UserResponse> updateDeliveryPersonnelAvailability(
            @PathVariable Long id, 
            @RequestParam boolean available) {
        User updatedUser = userService.updateDeliveryPersonnelAvailability(id, available);
        return ResponseEntity.ok(UserResponse.fromUser(updatedUser));
    }
    
    /**
     * Update delivery personnel location
     * @param id user ID
     * @param location current location
     * @return updated user
     */
    @PutMapping("/delivery-personnel/{id}/location")
    @PreAuthorize("hasRole('SYSTEM_ADMIN') or @userSecurity.isCurrentUser(#id)")
    public ResponseEntity<UserResponse> updateDeliveryPersonnelLocation(
            @PathVariable Long id, 
            @RequestParam String location) {
        User updatedUser = userService.updateDeliveryPersonnelLocation(id, location);
        return ResponseEntity.ok(UserResponse.fromUser(updatedUser));
    }

    /**
     * Change user password
     * @param id user ID
     * @param passwordChangeRequest password change details
     * @return success message
     */
    @PutMapping("/{id}/password")
    @PreAuthorize("hasRole('SYSTEM_ADMIN') or @userSecurity.isCurrentUser(#id)")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @Valid @RequestBody PasswordChangeRequest passwordChangeRequest) {
        userService.changePassword(id, passwordChangeRequest);
        return ResponseEntity.ok(new MessageResponse("Password changed successfully"));
    }
}
