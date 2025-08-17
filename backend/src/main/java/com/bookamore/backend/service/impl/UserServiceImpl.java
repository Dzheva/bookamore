package com.bookamore.backend.service.impl;

import com.bookamore.backend.entity.User;
import com.bookamore.backend.exception.EmailAlreadyExistsException;
import com.bookamore.backend.exception.ResourceNotFoundException;
import com.bookamore.backend.repository.UserRepository;
import com.bookamore.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    @Override
    public User create(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new EmailAlreadyExistsException("User with email " + user.getEmail() + " already exists.");
        }
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public Optional<User> findByEmailForAuth(String email) {
        return userRepository.findUserByEmail(email);
    }

    private User findByEmail(String email) {
        return userRepository.findUserByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Not found User with email = " + email));
    }
}
