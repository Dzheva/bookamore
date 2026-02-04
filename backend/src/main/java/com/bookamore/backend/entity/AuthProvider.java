package com.bookamore.backend.entity;

import com.bookamore.backend.entity.base.BaseEntity;
import com.bookamore.backend.entity.enums.ProviderType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "auth_providers",
        uniqueConstraints = @UniqueConstraint(columnNames = {"provider", "provider_user_id"}))
@EqualsAndHashCode(callSuper = false)
public class AuthProvider extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProviderType provider;

    @Column(name = "provider_user_id", nullable = false)
    private String providerUserId;

    @Column(name = "user_email", nullable = false)
    private String userEmail;
}
