package com.user.user_service.dto;

import com.user.user_service.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for updating user information
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserUpdateRequest {
    
    @Size(min = 3, max = 100, message = "Full name must be between 3 and 100 characters")
    private String fullName;
    
    @Size(max = 20, message = "Phone number cannot exceed 20 characters")
    private String phoneNumber;
    
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    @Email(message = "Email should be valid")
    private String email;
    
    private String address;
    
    private Role role;
    
    // Fields for specific roles
    private Boolean available; // For delivery personnel
    private String currentLocation; // For delivery personnel
    
    private Long restaurantId; // For restaurant admin
}