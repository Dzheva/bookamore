package com.bookamore.backend.service.impl;

import com.bookamore.backend.dto.user.UserResponse;
import com.bookamore.backend.entity.AuthProvider;
import com.bookamore.backend.entity.User;
import com.bookamore.backend.entity.enums.ProviderType;
import com.bookamore.backend.exception.EmailAlreadyExistsException;
import com.bookamore.backend.exception.ResourceNotFoundException;
import com.bookamore.backend.mapper.user.UserMapper;
import com.bookamore.backend.repository.AuthProviderRepository;
import com.bookamore.backend.repository.UserRepository;
import com.bookamore.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final AuthProviderRepository authProviderRepository;
    private final PasswordEncoder encoder;

    private final UserMapper userMapper;

    @Override
    public User create(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new EmailAlreadyExistsException("User with email " + user.getEmail() + " already exists.");
        }
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public User findOrCreateOAuth2User(ProviderType provider,
                                       String providerUserId,
                                       OAuth2User oAuth2User) {
        log.info("findOrCreateOAuth2User method is working!!!");
        // try to find and return existing user that has already logged in via particular 3d-party provider
        // with particular email or create new user and save it in DB
        Optional<AuthProvider> authProvider = authProviderRepository
                .findByProviderAndProviderUserId(provider, providerUserId);

        return authProvider.map(value -> updateUserAvatarAndName(value.getUser(), provider, oAuth2User))
                .orElseGet(() -> createOAuth2User(provider, providerUserId, oAuth2User));
    }

    private User createOAuth2User(ProviderType provider, String providerUserId, OAuth2User oAuth2User) {
        log.info("createOAuth2User method is working!!!");

        String email = oAuth2User.getAttribute("email");

        Optional<User> existingUser = userRepository.findUserByEmail(email);

        // user exists in DB -> add auth provider to the existing user
        // user doesn`t exist in DB -> create new user and add auth provider
        return existingUser
                .map(user -> linkProviderToUser(user, provider, providerUserId, oAuth2User))
                .orElseGet(() -> createNewOauth2User(provider, providerUserId, oAuth2User));
    }

    private User createNewOauth2User(ProviderType provider, String providerUserId, OAuth2User oAuth2User) {
        log.info("createNewOauth2User method is working!!!");

        User user = new User();
        user.setName(extractNameFromOauthUser(oAuth2User, provider));
        user.setEmail(oAuth2User.getAttribute("email"));
        user.setAvatarUrl(extractAvatarFromOauthUser(oAuth2User, provider));

        AuthProvider authProvider = new AuthProvider();
        authProvider.setProvider(provider);
        authProvider.setProviderUserId(providerUserId);
        String email = oAuth2User.getAttribute("email");
        if(email == null || email.trim().isEmpty()) {
            OAuth2Error oauth2Error = new OAuth2Error("missing_required_attribute",
                    "OAuth2User (provider - " + provider + ") has no mandatory attribute 'email'",
                    null);
            throw new OAuth2AuthenticationException(oauth2Error);
        }
        authProvider.setUserEmail(email);
        authProvider.setUser(user);

        user.getAuthProviders().add(authProvider);

        return userRepository.save(user);
    }

    private String extractNameFromOauthUser(OAuth2User oAuth2User, ProviderType provider) {
        return switch (provider) {
            case GOOGLE -> oAuth2User.getAttribute("name");
            case FACEBOOK -> oAuth2User.getAttribute("name");
            case DISCORD -> oAuth2User.getAttribute("global_name");
            case GITHUB -> oAuth2User.getAttribute("name");
        };
    }

    private String extractAvatarFromOauthUser(OAuth2User oAuth2User, ProviderType provider) {
        return switch (provider) {
            case GOOGLE -> oAuth2User.getAttribute("picture");
            case FACEBOOK -> oAuth2User.getAttribute("avatar_url");
            case DISCORD -> oAuth2User.getAttribute("avatar");
            case GITHUB -> oAuth2User.getAttribute("avatar_url");
        };
    }

    private User updateUserAvatarAndName(User user, ProviderType provider, OAuth2User oAuth2User) {
        log.info("updateUserAvatarAndName method is working!!!");

        user.setAvatarUrl(extractAvatarFromOauthUser(oAuth2User, provider));
        user.setName(extractNameFromOauthUser(oAuth2User, provider));
        return userRepository.save(user);
    }

    private User linkProviderToUser(User user, ProviderType provider, String providerUserId, OAuth2User oAuth2User) {
        log.info("linkProviderToUser method is working!!!");

        boolean providerIsAlreadyLinked = authProviderRepository.existsByUserAndProvider(user, provider);

        if (!providerIsAlreadyLinked) {
            updateUserAvatarAndName(user, provider, oAuth2User);

            AuthProvider authProvider = new AuthProvider();
            authProvider.setUser(user);
            authProvider.setProviderUserId(providerUserId);
            authProvider.setProvider(provider);
            String email = oAuth2User.getAttribute("email");
            if(email == null || email.trim().isEmpty()) {
                OAuth2Error oauth2Error = new OAuth2Error("missing_required_attribute",
                        "OAuth2User (provider - " + provider + ") has no mandatory attribute 'email'",
                        null);
                throw new OAuth2AuthenticationException(oauth2Error);
            }
            authProvider.setUserEmail(email);
            authProviderRepository.save(authProvider);
        }
        return user;
    }

    @Override
    public Optional<User> findByEmailForAuth(String email) {
        return userRepository.findUserByEmail(email);
    }

    private User findByEmail(String email) {
        return userRepository.findUserByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Not found User with email = " + email));
    }

    @Override
    public UserResponse getCurrentUser() {
        UserDetails principal = (UserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User user = findByEmail(principal.getUsername());

        return userMapper.userToUserResponse(user);
    }

    @Override
    public UserResponse findById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Not found User with uuid = " + id));

        return userMapper.userToUserResponse(user);
    }
}
