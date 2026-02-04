package com.bookamore.backend.service;

import com.bookamore.backend.dto.user.UserResponse;
import com.bookamore.backend.entity.User;
import com.bookamore.backend.entity.enums.ProviderType;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Optional;
import java.util.UUID;

public interface UserService {
    User create(User user);

    User findOrCreateOAuth2User(ProviderType provider,
                                String providerUserId,
                                OAuth2User oauth2User);

    Optional<User> findByEmailForAuth(String email);

    UserResponse getCurrentUser();

    UserResponse findById(UUID id);
}
