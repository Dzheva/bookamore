package com.bookamore.backend.dto.signin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
public class SignInResponse {
    private boolean status;
    private String error;
    private String token;

    public static SignInResponse ok(String token) {
        return new SignInResponse(true, null, token);
    }

    public static SignInResponse error(String msg) {
        return new SignInResponse(false, msg, null);
    }
}
