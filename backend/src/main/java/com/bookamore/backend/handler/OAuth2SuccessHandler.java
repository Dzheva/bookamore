package com.bookamore.backend.handler;

import com.bookamore.backend.jwt.JwtTokenService;
import com.bookamore.backend.jwt.JwtUserDetails;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Slf4j
@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    // SPA route that consumes the token/error query param and finishes the login
    static final String OAUTH2_CALLBACK_PATH = "/oauth2/callback";

    private final JwtTokenService tokenService;

    // CLIENT_URL may hold a comma-separated list (used as-is for CORS) — redirects use the
    // first origin, trailing slashes stripped so the callback path is not doubled up
    @Value("#{'${CLIENT_URL}'.split(',')[0].trim().replaceAll('/+$', '')}")
    private String clientUrl;

    public OAuth2SuccessHandler(JwtTokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        // get user from authentication
        JwtUserDetails oAuth2User = (JwtUserDetails) authentication.getPrincipal();

        // generate JWT token
        String token = tokenService.generateToken(oAuth2User.getId());

        log.info("OAuth2 login succeeded for user id {}", oAuth2User.getId());

        String redirectUrl = UriComponentsBuilder.fromUriString(clientUrl + OAUTH2_CALLBACK_PATH)
                .queryParam("token", token)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
