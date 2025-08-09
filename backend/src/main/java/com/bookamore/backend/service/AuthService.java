package com.bookamore.backend.service;

import com.bookamore.backend.dto.signin.SignInRequest;
import com.bookamore.backend.dto.signin.SignInResponse;
import com.bookamore.backend.dto.singup.SignUpRequest;
import com.bookamore.backend.dto.singup.SignUpResponse;
import com.bookamore.backend.entity.User;
import com.bookamore.backend.jwt.JwtTokenService;
import com.bookamore.backend.jwt.JwtUserDetails;
import com.bookamore.backend.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserService userService;
    private final UserMapper userMapper;
    private final JwtTokenService tokenService;

    private final PasswordEncoder encoder;

    public SignUpResponse signUp(SignUpRequest request) {
        User user = userService.create(userMapper.signUpRequestToUser(request));
        return userMapper.userToSignUpResponse(user);
    }

    public SignInResponse signIn(SignInRequest request) {

//        User user = userService.findByEmail(request.getEmail());
//
//        if (encoder.matches(request.getPassword(), user.getPassword())) {
//            String token = tokenService.generateToken(request.getEmail());
//            return SignInResponse.ok(token);
//        } else {
//            return SignInResponse.error();
//        }

        return userService.findByEmailForAuth(request.getEmail())
                .filter(user -> encoder.matches(request.getPassword(), user.getPassword()))
                .map(user -> tokenService.generateToken(user.getEmail()))
                .map(SignInResponse::ok)
                .orElseGet(SignInResponse::error);

    }

    private User getAuthUser() {
        JwtUserDetails principal = (JwtUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return principal.getUser();
    }
}
