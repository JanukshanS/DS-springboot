package com.user.user_service.dto;

import com.user.user_service.model.Role;
import com.user.user_service.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for user response data (excludes sensitive information)
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phoneNumber;
    private Role role;
    private String address;
    private boolean enabled;
    
    // Fields for specific roles
    private boolean available; // For delivery personnel
    private String currentLocation; // For delivery personnel
    private Long restaurantId; // For restaurant admin
    
    /**
     * Convert User entity to UserResponse DTO
     * @param user the user entity
     * @return UserResponse DTO
     */
    public static UserResponse fromUser(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setRole(user.getRole());
        response.setAddress(user.getAddress());
        response.setEnabled(user.isEnabled());
        response.setAvailable(user.isAvailable());
        response.setCurrentLocation(user.getCurrentLocation());
        response.setRestaurantId(user.getRestaurantId());
        return response;
    }
}