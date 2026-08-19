package com.bookamore.backend.util;

import com.bookamore.backend.jwt.JwtUserDetails;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static UUID getAuthenticatedUserId() {
        return getAuthenticatedUser().getId();
    }

    private static JwtUserDetails getAuthenticatedUser() {
        return (JwtUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }
}
