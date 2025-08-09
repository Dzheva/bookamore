package com.bookamore.backend.dto.singup;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignUpRequest {
    @NotBlank(message = "The name cannot be blank")
    @Size(min = 2, max = 100, message = "The name must consist of at least 2 characters")
    @Schema(example = "John Doe")
    private String name;
    @NotBlank(message = "The email name cannot be blank.")
    @Email(message = "Invalid email format")
    @Schema(example = "john@example.com")
    private String email;
    @NotBlank(message = "The password cannot be blank.")
    @Pattern(regexp = "(?=.*[a-z])(?=.*[A-Z]).{6,}",
            message = "The password must be at least 6 characters long " +
            "and contain at least 1 uppercase and 1 lowercase letter")
    @Schema(example = "myPassword123",
            description = "The password must be at least 6 characters long and contain at least 1 uppercase and 1 lowercase letter")
    private String password;
}
