package com.bookamore.backend.controller;

import com.bookamore.backend.dto.signin.SignInRequest;
import com.bookamore.backend.dto.signin.SignInResponse;
import com.bookamore.backend.dto.singup.SignUpRequest;
import com.bookamore.backend.dto.singup.SignUpResponse;
import com.bookamore.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("singup")
    @ResponseStatus(HttpStatus.CREATED)
    public SignUpResponse signUp(@Validated @RequestBody SignUpRequest request) {
        return authService.signUp(request);
    }

    @PostMapping("singin")
    @Operation(summary = "User Authentication", description = "Authenticates a user with their credentials and returns a JWT token.")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "Successful authentication", content = @Content(schema = @Schema(implementation = SignInResponse.class))), @ApiResponse(responseCode = "401", description = "Unauthorized access", content = @Content(schema = @Schema(implementation = SignInResponse.class), examples = @ExampleObject(name = "Invalid credentials example", value = "{\"status\": false, \"token\": null, \"error\": \"Invalid credentials\"}")))})
    public ResponseEntity<SignInResponse> signIn(@Validated @RequestBody SignInRequest request) {
        SignInResponse response = authService.signIn(request);
        return response.isStatus() ? ResponseEntity.ok(response) : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

}
