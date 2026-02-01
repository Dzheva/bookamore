package com.bookamore.backend.jwt;

import com.bookamore.backend.entity.User;
import com.bookamore.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceDetailsImpl implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        return loadUserById(UUID.fromString(userId));
    }

    public UserDetails loadUserById(UUID userId) {
        return userRepository.findById(userId)
                .map(this::remapper)
                .orElseThrow(() -> new UsernameNotFoundException("User with id " + userId + " not found"));
    }

    private UserDetails remapper(User user) {
        return new JwtUserDetails(user.getId(), user.getEmail());
    }
}
