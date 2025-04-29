package com.user.user_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for the application
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle resource not found exceptions
     */
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<?> resourceNotFoundException(UsernameNotFoundException ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(
                new Date(),
                ex.getMessage(),
                request.getDescription(false),
                HttpStatus.NOT_FOUND.value()
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }

    /**
     * Handle authentication exceptions
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<?> badCredentialsException(BadCredentialsException ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(
                new Date(),
                "Invalid username or password",
                request.getDescription(false),
                HttpStatus.UNAUTHORIZED.value()
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Handle validation exceptions
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            String fieldName = error.getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        ValidationErrorDetails errorDetails = new ValidationErrorDetails(
                new Date(),
                "Validation Failed",
                errors,
                HttpStatus.BAD_REQUEST.value()
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle general exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> globalExceptionHandler(Exception ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(
                new Date(),
                ex.getMessage(),
                request.getDescription(false),
                HttpStatus.INTERNAL_SERVER_ERROR.value()
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}