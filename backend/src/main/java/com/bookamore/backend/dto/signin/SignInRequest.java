package com.bookamore.backend.dto.signin;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SignInRequest {
    @NotBlank(message = "The email name cannot be blank.")
    private String email;
    @NotBlank(message = "The password cannot be blank.")
    @Email(message = "Invalid email format")
    private String password;
}
