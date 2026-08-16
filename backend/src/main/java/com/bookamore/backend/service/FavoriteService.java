package com.bookamore.backend.service;

import com.bookamore.backend.dto.offer.OfferResponse;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface FavoriteService {

    void addToFavorites(UUID offerId);

    void removeFromFavorites(UUID offerId);

    Page<OfferResponse> getFavorites(Integer page, Integer size, String sortBy, String sortDir);
}
