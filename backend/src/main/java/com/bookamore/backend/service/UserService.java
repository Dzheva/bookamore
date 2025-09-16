package com.bookamore.backend.service;

import com.bookamore.backend.dto.user.UserResponse;
import com.bookamore.backend.entity.User;

import java.util.Optional;
import java.util.UUID;

public interface UserService {
    User create(User user);

    Optional<User> findByEmailForAuth(String email);

    UserResponse getCurrentUser();

    UserResponse findByUuid(UUID uuid);
}
