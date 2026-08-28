package com.bookamore.backend.service.impl;

import com.bookamore.backend.dto.offer.OfferResponse;
import com.bookamore.backend.entity.Favorite;
import com.bookamore.backend.exception.ResourceNotFoundException;
import com.bookamore.backend.mapper.offer.OfferMapper;
import com.bookamore.backend.repository.FavoriteRepository;
import com.bookamore.backend.repository.OfferRepository;
import com.bookamore.backend.repository.UserRepository;
import com.bookamore.backend.service.FavoriteService;
import com.bookamore.backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final OfferRepository offerRepository;
    private final UserRepository userRepository;
    private final OfferMapper offerMapper;

    @Override
    @Transactional
    public void addToFavorites(UUID offerId) {
        if (!offerRepository.existsById(offerId)) {
            throw new ResourceNotFoundException("Offer not found with id: " + offerId);
        }

        Favorite favorite = new Favorite();
        favorite.setUserId(SecurityUtils.getAuthenticatedUserId());
        favorite.setOfferId(offerId);

        try {
            // flush is needed so that the FK - 404 wrapper is guaranteed to work with @Transactional
            favoriteRepository.saveAndFlush(favorite);
        } catch (DataIntegrityViolationException ex) {
            if (ex.getCause() instanceof ConstraintViolationException) {
                throw new ResourceNotFoundException("Offer not found with id: " + offerId);
            }
            throw ex;
        }
    }

    @Override
    @Transactional
    public void removeFromFavorites(UUID offerId) {
        favoriteRepository.deleteByUserIdAndOfferId(SecurityUtils.getAuthenticatedUserId(), offerId);
    }

    @Override
    public Page<OfferResponse> getFavorites(Integer page, Integer size, String sortBy, String sortDir) {
        Page<OfferResponse> fp = getFavoritesByUserId(SecurityUtils.getAuthenticatedUserId(), page, size, sortBy, sortDir);
        fp.forEach(o -> o.setFavorite(true));
        return fp;
    }

    @Override
    public Page<OfferResponse> getFavorites(UUID userId, Integer page, Integer size, String sortBy, String sortDir) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("Not found User with uuid = " + userId);
        }
        Page<OfferResponse> fp = getFavoritesByUserId(userId, page, size, sortBy, sortDir);
        fp.forEach(o -> o.setFavorite(true));
        return fp;
    }

    private Page<OfferResponse> getFavoritesByUserId(UUID userId, Integer page, Integer size, String sortBy, String sortDir) {
        Sort.Direction direction = Sort.Direction.fromString(sortDir);
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<OfferResponse> fp = favoriteRepository.findOffersByUserId(userId, pageable).map(offerMapper::toResponse);
        fp.forEach(o -> o.setFavorite(true));
        return fp;
    }
}
