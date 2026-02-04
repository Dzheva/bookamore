package com.bookamore.backend.service;

import com.bookamore.backend.entity.User;
import com.bookamore.backend.entity.enums.ProviderType;
import com.bookamore.backend.jwt.JwtUserDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class CustomOidcUserService extends OidcUserService {

    private final UserService userService;

    public CustomOidcUserService(UserService userService) {
        this.userService = userService;
    }

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("CustomOidcUserService is working!!!");

        OidcUser oidcUser = super.loadUser(userRequest);
        log.info("OIDC User: {}", oidcUser);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        ProviderType providerType = ProviderType.valueOf(registrationId.toUpperCase());
        String providerUserId = oidcUser.getName();

        log.info("OIDC Provider: {}, ProviderUserId: {}", providerType, providerUserId);

        User user = userService.findOrCreateOAuth2User(providerType, providerUserId, oidcUser);
        log.info("OIDC User found/created: id={}, email={}", user.getId(), user.getEmail());

        return new JwtUserDetails(user.getId(), user.getEmail(), oidcUser.getAttributes());
    }
}