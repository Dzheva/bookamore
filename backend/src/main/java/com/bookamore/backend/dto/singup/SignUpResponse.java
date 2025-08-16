package com.bookamore.backend.dto.singup;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class SignUpResponse {
    @Schema(example = "john@example.com")
    private String email;
    @Schema(example = "Sign up is successful!")
    private String message;
}
