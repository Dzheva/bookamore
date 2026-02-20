package com.bookamore.backend.service;

import com.bookamore.backend.entity.User;
import com.bookamore.backend.entity.enums.ProviderType;
import org.springframework.security.oauth2.core.user.OAuth2User;

public interface OAuth2Service {
    User findOrCreateOAuth2User(ProviderType provider,
                                String providerUserId,
                                OAuth2User oauth2User);
}
