package com.bookamore.backend.annotation;

import com.bookamore.backend.dto.error.ErrorResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
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
public @interface Api401Response {
}
