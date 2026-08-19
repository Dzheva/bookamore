package com.bookamore.backend.repository;

import com.bookamore.backend.entity.Favorite;
import com.bookamore.backend.entity.Offer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface FavoriteRepository extends JpaRepository<Favorite, Favorite.FavoriteId> {

    @Query("""
            SELECT o FROM Offer o
            JOIN Favorite f ON o.id = f.offerId
            JOIN FETCH o.book
            JOIN FETCH o.user
            WHERE f.userId = :userId
            """)
    Page<Offer> findOffersByUserId(UUID userId, Pageable pageable);

    void deleteByUserIdAndOfferId(UUID userId, UUID offerId);
}
