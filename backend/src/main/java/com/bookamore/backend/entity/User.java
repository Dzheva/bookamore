package com.bookamore.backend.entity;

import com.bookamore.backend.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
public class User extends BaseEntity {
    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column() // password can be null if user logged in via 3d-party provider
    private String password;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AuthProvider> authProviders = new ArrayList<>();
}
