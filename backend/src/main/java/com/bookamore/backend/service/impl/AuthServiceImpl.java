package com.bookamore.backend.service.impl;

import com.bookamore.backend.dto.signin.SignInRequest;
import com.bookamore.backend.dto.signin.SignInResponse;
import com.bookamore.backend.dto.singup.SignUpRequest;
import com.bookamore.backend.dto.singup.SignUpResponse;
import com.bookamore.backend.entity.User;
import com.bookamore.backend.jwt.JwtTokenService;
import com.bookamore.backend.mapper.user.UserMapper;
import com.bookamore.backend.service.AuthService;
import com.bookamore.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserService userService;
    private final UserMapper userMapper;
    private final JwtTokenService tokenService;
    private final PasswordEncoder encoder;

    @Override
    public SignUpResponse signUp(SignUpRequest request) {
        User user = userService.create(userMapper.signUpRequestToUser(request));
        return userMapper.userToSignUpResponse(user);
    }

    @Override
    public SignInResponse signIn(SignInRequest request) {
        return userService.findByEmailForAuth(request.getEmail())
                .filter(user -> encoder.matches(request.getPassword(), user.getPassword()))
                .map(user -> tokenService.generateToken(user.getId()))
                .map(SignInResponse::ok)
                .orElseGet(SignInResponse::error);
    }
}
