package com.bookamore.backend.controller;

import com.bookamore.backend.dto.user.UserResponse;
import com.bookamore.backend.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("api/v1/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("current-user")
    public ResponseEntity<UserResponse> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @GetMapping("{uuid}")
    public ResponseEntity<UserResponse> getUserByUuid(@PathVariable("uuid") UUID uuid) {
        return ResponseEntity.ok(userService.findByUuid(uuid));
    }
}
