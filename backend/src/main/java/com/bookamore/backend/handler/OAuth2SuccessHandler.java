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
    private final JwtTokenService tokenService;


    @Value("${CLIENT_URL}")
    private String clientUrl;

    public OAuth2SuccessHandler(JwtTokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        log.info("onAuthenticationSuccess method is WORKING!!!");

        // get user from authentication
        JwtUserDetails oAuth2User = (JwtUserDetails) authentication.getPrincipal();

        // generate JWT token
        String token = tokenService.generateToken(oAuth2User.getId());

        String redirectUrl = UriComponentsBuilder.fromUriString(clientUrl + "/login")
                .queryParam("token", token)
                .queryParam("userEmail", oAuth2User.getEmail())
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
