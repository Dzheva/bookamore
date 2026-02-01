package com.bookamore.backend.service.impl;

import com.bookamore.backend.dto.user.UserResponse;
import com.bookamore.backend.entity.User;
import com.bookamore.backend.exception.EmailAlreadyExistsException;
import com.bookamore.backend.exception.ResourceNotFoundException;
import com.bookamore.backend.mapper.user.UserMapper;
import com.bookamore.backend.repository.UserRepository;
import com.bookamore.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    private final UserMapper userMapper;

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

    @Override
    public UserResponse getCurrentUser() {
        UserDetails principal = (UserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User user = findByEmail(principal.getUsername());

        return userMapper.userToUserResponse(user);
    }

    @Override
    public UserResponse findById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Not found User with uuid = " + id));

        return userMapper.userToUserResponse(user);
    }
}
