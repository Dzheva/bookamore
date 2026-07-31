package com.bookamore.backend.handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Slf4j
@Component
public class OAuth2FailureHandler extends SimpleUrlAuthenticationFailureHandler {

    // CLIENT_URL may hold a comma-separated list (used as-is for CORS) — redirects use the
    // first origin, trailing slashes stripped so the callback path is not doubled up
    @Value("#{'${CLIENT_URL}'.split(',')[0].trim().replaceAll('/+$', '')}")
    private String clientUrl;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        log.warn("OAuth2 login failed: {}", exception.getMessage());

        String redirectUrl = UriComponentsBuilder.fromUriString(clientUrl + OAuth2SuccessHandler.OAUTH2_CALLBACK_PATH)
                .queryParam("error", "oauth2_login_failed")
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
