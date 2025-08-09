package com.bookamore.backend.controller;

import com.bookamore.backend.dto.signin.SignInRequest;
import com.bookamore.backend.dto.signin.SignInResponse;
import com.bookamore.backend.dto.singup.SignUpRequest;
import com.bookamore.backend.dto.singup.SignUpResponse;
import com.bookamore.backend.service.AuthService;
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
public class Auth {
    private final AuthService authService;

    @PostMapping("singup")
    @ResponseStatus(HttpStatus.CREATED)
    public SignUpResponse signUp(@Validated @RequestBody SignUpRequest request){
        return authService.signUp(request);
    }

    @PostMapping("singin")
    public ResponseEntity<SignInResponse> signIn(@Validated @RequestBody SignInRequest request){
        SignInResponse response = authService.signIn(request);
        return response.isStatus()
                ? ResponseEntity.ok(response)
                : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

}
