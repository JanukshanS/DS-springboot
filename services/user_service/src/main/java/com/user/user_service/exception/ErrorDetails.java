package com.user.user_service.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

/**
 * Error details model for API error responses
 */
@Data
@AllArgsConstructor
public class ErrorDetails {
    private Date timestamp;
    private String message;
    private String details;
    private int status;
}