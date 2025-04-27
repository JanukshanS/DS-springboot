package com.user.user_service.service;

import com.user.user_service.dto.PasswordChangeRequest;
import com.user.user_service.dto.UserUpdateRequest;
import com.user.user_service.model.Role;
import com.user.user_service.model.User;
import com.user.user_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service for user-related operations
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Get all users
     * @return list of all users
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Get user by ID
     * @param id user ID
     * @return user if found
     */
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
    }

    /**
     * Get user by username
     * @param username username
     * @return user if found
     */
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    /**
     * Get user by email
     * @param email email address
     * @return user if found
     */
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Update user information
     * @param id user ID
     * @param updateRequest updated user information
     * @return updated user
     */
    public User updateUser(Long id, UserUpdateRequest updateRequest) {
        User user = getUserById(id);
        
        if (updateRequest.getFullName() != null) {
            user.setFullName(updateRequest.getFullName());
        }
        
        if (updateRequest.getPhoneNumber() != null) {
            user.setPhoneNumber(updateRequest.getPhoneNumber());
        }
        
        if (updateRequest.getEmail() != null && !updateRequest.getEmail().equals(user.getEmail())) {
            // Check if email is already in use by another user
            Optional<User> existingUser = userRepository.findByEmail(updateRequest.getEmail());
            if (existingUser.isPresent() && !existingUser.get().getId().equals(id)) {
                throw new RuntimeException("Email is already in use!");
            }
            user.setEmail(updateRequest.getEmail());
        }
        
        if (updateRequest.getAddress() != null) {
            user.setAddress(updateRequest.getAddress());
        }
        
        // Only administrators can change roles
        if (updateRequest.getRole() != null) {
            user.setRole(updateRequest.getRole());
        }
        
        // Update role-specific fields
        if (user.getRole() == Role.DELIVERY_PERSONNEL) {
            if (updateRequest.getAvailable() != null) {
                user.setAvailable(updateRequest.getAvailable());
            }
            if (updateRequest.getCurrentLocation() != null) {
                user.setCurrentLocation(updateRequest.getCurrentLocation());
            }
        } else if (user.getRole() == Role.RESTAURANT_ADMIN) {
            if (updateRequest.getRestaurantId() != null) {
                user.setRestaurantId(updateRequest.getRestaurantId());
            }
        }
        
        return userRepository.save(user);
    }

    /**
     * Change user password
     * @param id user ID
     * @param passwordChangeRequest password change details
     * @return updated user
     */
    public User changePassword(Long id, PasswordChangeRequest passwordChangeRequest) {
        User user = getUserById(id);
        
        // Verify current password
        if (!passwordEncoder.matches(passwordChangeRequest.getCurrentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect");
        }
        
        // Verify new password matches confirmation
        if (!passwordChangeRequest.getNewPassword().equals(passwordChangeRequest.getConfirmPassword())) {
            throw new RuntimeException("New password and confirmation do not match");
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(passwordChangeRequest.getNewPassword()));
        
        return userRepository.save(user);
    }

    /**
     * Delete a user
     * @param id user ID
     */
    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }
    
    /**
     * Get all delivery personnel
     * @return list of delivery personnel
     */
    public List<User> getAllDeliveryPersonnel() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == Role.DELIVERY_PERSONNEL)
                .toList();
    }
    
    /**
     * Get all available delivery personnel
     * @return list of available delivery personnel
     */
    public List<User> getAvailableDeliveryPersonnel() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == Role.DELIVERY_PERSONNEL && user.isAvailable())
                .toList();
    }
    
    /**
     * Update delivery personnel availability
     * @param id user ID
     * @param available availability status
     * @return updated user
     */
    public User updateDeliveryPersonnelAvailability(Long id, boolean available) {
        User user = getUserById(id);
        
        if (user.getRole() != Role.DELIVERY_PERSONNEL) {
            throw new IllegalArgumentException("User is not a delivery personnel");
        }
        
        user.setAvailable(available);
        return userRepository.save(user);
    }
    
    /**
     * Update delivery personnel location
     * @param id user ID
     * @param location current location
     * @return updated user
     */
    public User updateDeliveryPersonnelLocation(Long id, String location) {
        User user = getUserById(id);
        
        if (user.getRole() != Role.DELIVERY_PERSONNEL) {
            throw new IllegalArgumentException("User is not a delivery personnel");
        }
        
        user.setCurrentLocation(location);
        return userRepository.save(user);
    }
}