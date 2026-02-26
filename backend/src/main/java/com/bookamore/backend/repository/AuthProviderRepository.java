package com.bookamore.backend.repository;

import com.bookamore.backend.entity.AuthProvider;
import com.bookamore.backend.entity.User;
import com.bookamore.backend.entity.enums.ProviderType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AuthProviderRepository extends JpaRepository<AuthProvider, UUID> {
    @EntityGraph(attributePaths = {"user"})
    Optional<AuthProvider> findByProviderAndProviderUserId(ProviderType providerType, String providerUserId);

    @Query("SELECT COUNT(ap) > 0 FROM AuthProvider ap " +
            "WHERE ap.user = :user AND ap.provider = :provider")
    boolean existsByUserAndProvider(@Param("user") User user,
                                    @Param("provider") ProviderType provider);
}
