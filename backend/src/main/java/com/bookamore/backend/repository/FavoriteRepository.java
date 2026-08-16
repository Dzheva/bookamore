package com.bookamore.backend.repository;

import com.bookamore.backend.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FavoriteRepository extends JpaRepository<Favorite, Favorite.FavoriteId> {

    List<Favorite> findAllByUserId(UUID userId);

    void deleteByUserIdAndOfferId(UUID userId, UUID offerId);
}
