package com.bookamore.backend.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {
    private static final String BEARER = "Bearer ";
    private static final String AUTH_HEADER = HttpHeaders.AUTHORIZATION;
    private final JwtTokenService jwtTokenService;
    private final UserServiceDetailsImpl userServiceDetails;

    private Optional<String> extractTokenFromRequest(HttpServletRequest rq) {
        return Optional.ofNullable(rq.getHeader(AUTH_HEADER))
                .filter(h -> h.startsWith(BEARER))
                .map(h -> h.substring(BEARER.length()));
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest rq,
                                    @NonNull HttpServletResponse rs,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        extractTokenFromRequest(rq).ifPresent(token -> {
            try {
                String username = jwtTokenService.extractUsername(token);

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userServiceDetails.loadUserByUsername(username);

                    if (jwtTokenService.validateToken(token, userDetails)) {
                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        userDetails.getAuthorities()
                                );

                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(rq));

                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            } catch (Exception e) {
                log.warn("JWT processing failed: {}", e.getMessage());
            }
        });


        filterChain.doFilter(rq, rs);
    }
}
