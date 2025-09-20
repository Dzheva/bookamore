package com.bookamore.backend.mapper.user;

import com.bookamore.backend.dto.singup.SignUpRequest;
import com.bookamore.backend.dto.singup.SignUpResponse;
import com.bookamore.backend.dto.user.UserResponse;
import com.bookamore.backend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User signUpRequestToUser(SignUpRequest signUpRequest);
    UserResponse userToUserResponse(User user);
    @Mapping(target = "message", constant = "Sign up is successful!")
    SignUpResponse userToSignUpResponse(User user);
}
