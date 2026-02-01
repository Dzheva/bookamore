package com.bookamore.backend.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.UUID;

@Data
public class UserResponse {
    @Schema(example = "d367ec63-a73b-485d-a1c8-6b793b009e53")
    private UUID id;
    @Schema(example = "John")
    private String name;
    @Schema(example = "john@example.com")
    private String email;
}
