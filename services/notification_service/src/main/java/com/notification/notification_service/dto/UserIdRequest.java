package com.notification.notification_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserIdRequest {

    @NotBlank
    private String userId;
}