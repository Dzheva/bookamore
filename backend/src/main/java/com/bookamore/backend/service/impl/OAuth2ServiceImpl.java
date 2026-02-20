package com.bookamore.backend.service.impl;

import com.bookamore.backend.entity.AuthProvider;
import com.bookamore.backend.entity.User;
import com.bookamore.backend.entity.enums.ProviderType;
import com.bookamore.backend.repository.AuthProviderRepository;
import com.bookamore.backend.repository.UserRepository;
import com.bookamore.backend.service.OAuth2Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OAuth2ServiceImpl implements OAuth2Service {
    private final UserRepository userRepository;
    private final AuthProviderRepository authProviderRepository;

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

    private User linkProviderToUser(User user, ProviderType provider, String providerUserId, OAuth2User oAuth2User) {
        log.info("linkProviderToUser method is working!!!");

        boolean providerIsAlreadyLinked = authProviderRepository.existsByUserAndProvider(user, provider);

        if (!providerIsAlreadyLinked) {
            updateUserAvatarAndName(user, provider, oAuth2User);

            AuthProvider authProvider = new AuthProvider();
            authProvider.setUser(user);
            authProvider.setProvider(provider);
            authProvider.setProviderUserId(providerUserId);
            String email = oAuth2User.getAttribute("email");
            if(email == null || email.trim().isEmpty()) {
                OAuth2Error oauth2Error = new OAuth2Error("missing_required_attribute",
                        "OAuth2User (provider - %s, userId in DB - %s) has no mandatory attribute 'email'".formatted(provider, user.getId()),
                        null);
                throw new OAuth2AuthenticationException(oauth2Error);
            }
            authProviderRepository.save(authProvider);
        }
        return user;
    }

    private User createNewOauth2User(ProviderType provider, String providerUserId, OAuth2User oAuth2User) {
        log.info("createNewOauth2User method is working!!!");

        User user = new User();
        user.setName(oAuth2User.getAttribute("name"));
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
        authProvider.setUser(user);

        user.getAuthProviders().add(authProvider);

        return userRepository.save(user);
    }

    private User updateUserAvatarAndName(User user, ProviderType provider, OAuth2User oAuth2User) {
        log.info("updateUserAvatarAndName method is working!!!");

        user.setAvatarUrl(extractAvatarFromOauthUser(oAuth2User, provider));
        user.setName(oAuth2User.getAttribute("name"));
        return userRepository.save(user);
    }

    private String extractAvatarFromOauthUser(OAuth2User oAuth2User, ProviderType provider) {
        return switch (provider) {
            case GOOGLE -> oAuth2User.getAttribute("picture");
            case FACEBOOK -> oAuth2User.getAttribute("avatar_url");
        };
    }
}
