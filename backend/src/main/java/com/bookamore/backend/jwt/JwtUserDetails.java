package com.bookamore.backend.jwt;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.*;

@Getter
public class JwtUserDetails implements UserDetails, OAuth2User, OidcUser {
    private final UUID id;
    private final String email;
    private final Map<String, Object> attributes; // for oauth2 users

    // constructor for JWT (w/o OAuth2 attributes)
    public JwtUserDetails(UUID id, String email) {
        this.id = id;
        this.email = email;
        this.attributes = new HashMap<>();
    }

    // constructor for OAuth2 users
    public JwtUserDetails(UUID id, String email, Map<String, Object> attributes) {
        this.id = id;
        this.email = email;
        this.attributes = attributes == null ? new HashMap<>() : attributes;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.EMPTY_LIST;
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String getName() {
        return email;
    }

    @Override
    public Map<String, Object> getClaims() {
        return attributes;
    }

    @Override
    public OidcUserInfo getUserInfo() {
        return OidcUserInfo.builder()
                .subject(String.valueOf(id))
                .email(email)
                .build();
    }

    @Override
    public OidcIdToken getIdToken() {
        return null;
    }
}
