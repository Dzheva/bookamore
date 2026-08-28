package com.bookamore.backend.service.impl;

import com.bookamore.backend.dto.offer.OfferResponse;
import com.bookamore.backend.dto.offer.OfferWithBookResponse;
import com.bookamore.backend.repository.FavoriteRepository;
import com.bookamore.backend.service.OfferFavoriteMarker;
import com.bookamore.backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.function.BiConsumer;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
class OfferFavoriteMarkerImpl implements OfferFavoriteMarker {

    private final FavoriteRepository favoriteRepository;

    @Override
    public Page<OfferResponse> mark(Page<OfferResponse> page) {
        mark(page.getContent());
        return page;
    }

    @Override
    public OfferResponse mark(OfferResponse response) {
        if (response != null) {
            mark(List.of(response));
        }
        return response;
    }

    @Override
    public Page<OfferWithBookResponse> markWithBook(Page<OfferWithBookResponse> page) {
        markWithBook(page.getContent());
        return page;
    }

    @Override
    public OfferWithBookResponse markWithBook(OfferWithBookResponse response) {
        if (response != null) {
            markWithBook(List.of(response));
        }
        return response;
    }

    private void mark(List<OfferResponse> responses) {
        applyFavoriteMarks(responses, OfferResponse::getId, OfferResponse::setFavorite);
    }

    private void markWithBook(List<OfferWithBookResponse> responses) {
        applyFavoriteMarks(responses, OfferWithBookResponse::getId, OfferWithBookResponse::setFavorite);
    }

    private <T> void applyFavoriteMarks(
            List<T> responses,
            Function<T, UUID> idGetter,
            BiConsumer<T, Boolean> favoriteSetter) {

        if (responses.isEmpty()) {
            return;
        }

        UUID currentUserId = SecurityUtils.getAuthenticatedUserId();
        if (currentUserId == null) {
            return;
        }

        Set<UUID> favoriteIds = favoriteRepository.findOfferIdsByUserIdAndOfferIdIn(
                currentUserId,
                responses.stream().map(idGetter).toList()
        );

        responses.forEach(response ->
                favoriteSetter.accept(response, favoriteIds.contains(idGetter.apply(response))));
    }
}
