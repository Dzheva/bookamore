package com.bookamore.backend.service;

import com.bookamore.backend.entity.User;

import java.util.Optional;

public interface UserService {
    User create(User user);

    Optional<User> findByEmailForAuth(String email);
}
