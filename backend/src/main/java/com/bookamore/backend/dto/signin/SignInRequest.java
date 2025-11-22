package com.bookamore.backend.dto.signin;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SignInRequest {
    @NotBlank(message = "The email cannot be blank.")
    @Schema(example = "john.doe@example.com")
    private String email;
    @NotBlank(message = "The password cannot be blank.")
    @Schema(example = "myPassword123")
    private String password;
}
