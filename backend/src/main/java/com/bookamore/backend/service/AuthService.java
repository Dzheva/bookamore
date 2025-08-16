package com.bookamore.backend.service;

import com.bookamore.backend.dto.signin.SignInRequest;
import com.bookamore.backend.dto.signin.SignInResponse;
import com.bookamore.backend.dto.singup.SignUpRequest;
import com.bookamore.backend.dto.singup.SignUpResponse;

public interface AuthService {

    SignUpResponse signUp(SignUpRequest request);

    SignInResponse signIn(SignInRequest request);
}
