package com.bookamore.backend.mapper;

import com.bookamore.backend.dto.singup.SignUpRequest;
import com.bookamore.backend.dto.singup.SignUpResponse;
import com.bookamore.backend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "name", source = "signUpRequest.name")
    @Mapping(target = "email", source = "signUpRequest.email")
    @Mapping(target = "password", source = "signUpRequest.password")
    User toUser(SignUpRequest signUpRequest);

    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "message", constant = "Sign up is successful!")
    SignUpResponse toSignUpResponse(User user);
}
