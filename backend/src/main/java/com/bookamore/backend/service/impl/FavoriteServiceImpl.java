package com.bookamore.backend.service.impl;

import com.bookamore.backend.dto.offer.OfferResponse;
import com.bookamore.backend.entity.Favorite;
import com.bookamore.backend.exception.ResourceNotFoundException;
import com.bookamore.backend.jwt.JwtUserDetails;
import com.bookamore.backend.mapper.offer.OfferMapper;
import com.bookamore.backend.repository.FavoriteRepository;
import com.bookamore.backend.repository.OfferRepository;
import com.bookamore.backend.repository.UserRepository;
import com.bookamore.backend.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
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
        favorite.setUserId(currentUserId());
        favorite.setOfferId(offerId);

        try {
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
        favoriteRepository.deleteByUserIdAndOfferId(currentUserId(), offerId);
    }

    @Override
    public Page<OfferResponse> getFavorites(Integer page, Integer size, String sortBy, String sortDir) {
        return getFavoritesByUserId(currentUserId(), page, size, sortBy, sortDir);
    }

    @Override
    public Page<OfferResponse> getFavorites(UUID userId, Integer page, Integer size, String sortBy, String sortDir) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("Not found User with uuid = " + userId);
        }
        return getFavoritesByUserId(userId, page, size, sortBy, sortDir);
    }

    private Page<OfferResponse> getFavoritesByUserId(UUID userId, Integer page, Integer size, String sortBy, String sortDir) {
        Sort.Direction direction = Sort.Direction.fromString(sortDir);
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        return favoriteRepository.findOffersByUserId(userId, pageable).map(offerMapper::toResponse);
    }

    private UUID currentUserId() {
        JwtUserDetails principal = (JwtUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        return principal.getId();
    }
}
