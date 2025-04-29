package com.user.user_service.exception;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.Map;

/**
 * Validation error details for handling validation errors
 */
@Getter
@Setter
public class ValidationErrorDetails extends ErrorDetails {
    private Map<String, String> errors;
    
    public ValidationErrorDetails(Date timestamp, String message, Map<String, String> errors, int status) {
        super(timestamp, message, null, status);
        this.errors = errors;
    }
}