package com.bookamore.backend.service;

import com.bookamore.backend.dto.singup.SignUpRequest;
import com.bookamore.backend.dto.singup.SignUpResponse;
import com.bookamore.backend.entity.User;
import com.bookamore.backend.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserService userService;
    private final UserMapper userMapper;
    public SignUpResponse signUp(SignUpRequest request){
        User user = userService.create(userMapper.signUpRequestToUser(request));
        return userMapper.userToSignUpResponse(user);
    }
}
