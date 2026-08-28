package com.bookamore.backend.service.impl;

import com.bookamore.backend.dto.offer.OfferResponse;
import com.bookamore.backend.dto.offer.OfferWithBookResponse;
import com.bookamore.backend.repository.FavoriteRepository;
import com.bookamore.backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Component
@RequiredArgsConstructor
class OfferFavoriteMarker {

    private final FavoriteRepository favoriteRepository;

    Page<OfferResponse> mark(Page<OfferResponse> page) {
        mark(page.getContent());
        return page;
    }

    OfferResponse mark(OfferResponse response) {
        if (response != null) {
            mark(List.of(response));
        }
        return response;
    }

    private void mark(List<OfferResponse> responses) {
        if (responses == null || responses.isEmpty()) {
            return;
        }

        UUID currentUserId = SecurityUtils.getAuthenticatedUserId();
        if (currentUserId == null) {
            return;
        }
        Set<UUID> favoriteIds = favoriteRepository.findOfferIdsByUserIdAndOfferIdIn(
                currentUserId,
                responses.stream().map(OfferResponse::getId).toList()
        );
        responses.forEach(response -> response.setFavorite(favoriteIds.contains(response.getId())));
    }

    Page<OfferWithBookResponse> markWithBook(Page<OfferWithBookResponse> page) {
        markWithBook(page.getContent());
        return page;
    }

    OfferWithBookResponse markWithBook(OfferWithBookResponse response) {
        if (response != null) {
            markWithBook(List.of(response));
        }
        return response;
    }

    private void markWithBook(List<OfferWithBookResponse> responses) {
        if (responses == null || responses.isEmpty()) {
            return;
        }

        UUID currentUserId = SecurityUtils.getAuthenticatedUserId();
        if (currentUserId == null) {
            return;
        }
        Set<UUID> favoriteIds = favoriteRepository.findOfferIdsByUserIdAndOfferIdIn(
                currentUserId,
                responses.stream().map(OfferWithBookResponse::getId).toList()
        );
        responses.forEach(response -> response.setFavorite(favoriteIds.contains(response.getId())));
    }
}
