package com.bookamore.backend.dto.signin;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Sign-in response DTO")
public class SignInResponse {
    @Schema(description = "Indicates whether the sign-in was successful", example = "true")
    private boolean status;
    @Schema(description = "JWT token if sign-in was successful", example = "eyJhbGciOiJIUzI1NiIsInR...", nullable = true)
    private String token;
    @Schema(description = "Error message if sign-in failed", example = "Invalid credentials", nullable = true)
    private String error;

    public static SignInResponse ok(String token) {
        return new SignInResponse(true, token, null);
    }

    public static SignInResponse error() {
        return new SignInResponse(false, null, "Invalid credentials");
    }
}
