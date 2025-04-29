package com.user.user_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for password change requests
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PasswordChangeRequest {
    
    @NotBlank(message = "Current password is required")
    private String currentPassword;
    
    @NotBlank(message = "New password is required")
    @Size(min = 6, max = 120, message = "New password must be between 6 and 120 characters")
    private String newPassword;
    
    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;
}