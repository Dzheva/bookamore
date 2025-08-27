package com.bookamore.backend.exception;

import com.bookamore.backend.dto.error.ErrorResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;

import java.time.LocalDateTime;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ErrorResponse handleEmailAlreadyExistsException(EmailAlreadyExistsException ex, HttpServletRequest request) {

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.CONFLICT.value())
                .error(HttpStatus.CONFLICT.getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();

        log.warn("EmailAlreadyExistsException: {}", errorResponse);

        return errorResponse;
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(HttpClientErrorException.Unauthorized.class)
    @ApiResponse(
            responseCode = "401",
            description = "Unauthorized Access",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = ErrorResponse.class),
                    examples = @ExampleObject(
                            name = "Unauthorized Error Example",
                            value = "{\"timestamp\": \"2025-08-16T12:00:00.000Z\", \"status\": 401, \"error\": \"Unauthorized\", \"message\": \"Authentication failed. Please log in or provide a valid token.\", \"path\": \"/api/v1/protected/data\"}"
                    )
            )
    )
    public ErrorResponse handleUnauthorizedException(HttpClientErrorException.Unauthorized ex, HttpServletRequest request) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.UNAUTHORIZED.value())
                .error(HttpStatus.UNAUTHORIZED.getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(ResourceNotFoundException.class)
    @ApiResponse(
            responseCode = "404",
            description = "Not Found: The requested resource was not found",
            content = @Content(
                    schema = @Schema(implementation = ErrorResponse.class),
                    examples = @ExampleObject(
                            name = "Resource Not Found Example",
                            value = "{\"timestamp\": \"2025-08-13T10:00:00.000Z\", \"status\": 404, \"error\": \"Not Found\", \"message\": \"Resource with email john@example.com not found\", \"path\": \"/api/v1/signup\"}"
                    )
            )
    )
    public ErrorResponse handleResourceNotFoundException(ResourceNotFoundException ex, HttpServletRequest request) {

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.NOT_FOUND.value())
                .error(HttpStatus.NOT_FOUND.getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();

        log.warn("ResourceNotFoundException: {}", errorResponse);

        return errorResponse;
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ApiResponse(
            responseCode = "400",
            description = "Bad Request: Invalid request payload or parameter",
            content = @Content(
                    schema = @Schema(implementation = ErrorResponse.class),
                    examples = @ExampleObject(
                            name = "Validation Error Example",
                            value = "{\"timestamp\": \"2025-08-13T10:00:00.000Z\", \"status\": 400, \"error\": \"Bad Request\", \"message\": \"email cannot be null\", \"path\": \"/api/v1/signup\"}"
                    )
            )
    )
    public ErrorResponse handleValidationExceptions(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String defaultErrorMessage = "Validation failed";
        String firstErrorMessage = ex.getBindingResult().getFieldError() != null ?
                ex.getBindingResult().getFieldError().getDefaultMessage() :
                defaultErrorMessage;

        String fieldName = "unknown";
        Object rejectedValue = null;
        if (ex.getBindingResult().getFieldError() != null) {
            fieldName = ex.getBindingResult().getFieldError().getField();
            rejectedValue = ex.getBindingResult().getFieldError().getRejectedValue();
        }

        log.warn("Validation failed for field '{}' with value '{}': {}", fieldName, rejectedValue, firstErrorMessage);

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message(firstErrorMessage)
                .path(request.getRequestURI())
                .build();

        log.warn("Validation failed: {}", errorResponse);

        return errorResponse;
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content(
                    schema = @Schema(implementation = ErrorResponse.class),
                    examples = @ExampleObject(
                            name = "Validation Error Example",
                            value = "{\"timestamp\": \"2025-08-13T10:00:00.000Z\", \"status\": 500, \"error\": \"Internal server error\", \"message\": \"something wrong happened\", \"path\": \"/api/v1/books\"}"
                    )
            )
    )
    public ErrorResponse handleUnknownException(Exception ex, HttpServletRequest request) {
        int endMessageIndex = Math.min(ex.getMessage().length(), 100);

        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                .message(ex.getMessage().substring(0, endMessageIndex))
                .path(request.getRequestURI())
                .build();
    }
}
