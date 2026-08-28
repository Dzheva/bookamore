package com.bookamore.backend.service.impl;

import com.bookamore.backend.dto.offer.OfferResponse;
import com.bookamore.backend.dto.offer.OfferWithBookResponse;
import com.bookamore.backend.repository.FavoriteRepository;
import com.bookamore.backend.service.OfferFavoriteCounter;
import com.bookamore.backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.BiConsumer;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
class OfferFavoriteCounterImpl implements OfferFavoriteCounter {

    private final FavoriteRepository favoriteRepository;

    @Override
    public Page<OfferResponse> count(Page<OfferResponse> page) {
        count(page.getContent());
        return page;
    }

    @Override
    public OfferResponse count(OfferResponse response) {
        if (response != null) {
            count(List.of(response));
        }
        return response;
    }

    @Override
    public Page<OfferWithBookResponse> countWithBook(Page<OfferWithBookResponse> page) {
        countWithBook(page.getContent());
        return page;
    }

    @Override
    public OfferWithBookResponse countWithBook(OfferWithBookResponse response) {
        if (response != null) {
            countWithBook(List.of(response));
        }
        return response;
    }

    private void count(List<OfferResponse> responses) {
        applyFavoriteCounts(responses, OfferResponse::getId, OfferResponse::setFavoritesCount);
    }

    private void countWithBook(List<OfferWithBookResponse> responses) {
        applyFavoriteCounts(responses, OfferWithBookResponse::getId, OfferWithBookResponse::setFavoritesCount);
    }

    private <T> void applyFavoriteCounts(
            List<T> responses,
            Function<T, UUID> idGetter,
            BiConsumer<T, Long> countSetter) {

        if (responses.isEmpty()) {
            return;
        }

        UUID currentUserId = SecurityUtils.getAuthenticatedUserId();
        if (currentUserId == null) {
            return;
        }

        Map<UUID, Long> offerCounts = countByOfferIdIn(
                responses.stream().map(idGetter).toList(),
                currentUserId
        );

        responses.forEach(response -> {
            Long count = offerCounts.get(idGetter.apply(response));
            if (count != null) {
                countSetter.accept(response, count);
            }
        });
    }

    private Map<UUID, Long> countByOfferIdIn(Collection<UUID> offerIds, UUID authorId) {
        if (offerIds == null || offerIds.isEmpty()) {
            return Map.of();
        }

        Map<UUID, Long> counts = new HashMap<>();

        List<FavoriteRepository.OfferFavoriteCount> favoriteCountsByOfferIdIn =
            favoriteRepository.countFavoritesByOfferIdIn(offerIds, authorId);
        for (FavoriteRepository.OfferFavoriteCount row : favoriteCountsByOfferIdIn) {
            counts.put(row.getOfferId(), row.getFavoriteCount());
        }
        return counts;
    }
}
