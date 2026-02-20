package com.bookamore.backend.service;

import com.bookamore.backend.entity.User;
import com.bookamore.backend.entity.enums.ProviderType;
import com.bookamore.backend.jwt.JwtUserDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final OAuth2Service oAuth2Service;

    public CustomOAuth2UserService(OAuth2Service oAuth2Service) {
        this.oAuth2Service = oAuth2Service;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("CustomOAuth2UserService is working!!!");

        OAuth2User oAuth2User = super.loadUser(userRequest);
        log.info("OAuth2User: {}", oAuth2User);

        // get provider info
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        ProviderType providerType = ProviderType.valueOf(registrationId.toUpperCase());
        String providerUserId = oAuth2User.getName();

        log.info("providerType: {}, providerUserId: {}", providerType, providerUserId);
        // find existing user in DB or create one
        User user = oAuth2Service.findOrCreateOAuth2User(providerType, providerUserId, oAuth2User);

        log.info("User from findOrCreateOAuth2User method : id - {}, email - {}", user.getId(), user.getEmail());

        // create JwtUserDetails object for Spring Security
        return new JwtUserDetails(user.getId(), user.getEmail(), oAuth2User.getAttributes());
    }
}