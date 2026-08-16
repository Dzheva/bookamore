package com.bookamore.backend.controller;

import com.bookamore.backend.dto.offer.OfferResponse;
import com.bookamore.backend.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("api/v1/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/{offerId}")
    public ResponseEntity<Void> addToFavorites(@PathVariable UUID offerId) {
        favoriteService.addToFavorites(offerId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{offerId}")
    public ResponseEntity<Void> removeFromFavorites(@PathVariable UUID offerId) {
        favoriteService.removeFromFavorites(offerId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public Page<OfferResponse> getFavorites(@RequestParam(defaultValue = "0") Integer page,
                                            @RequestParam(defaultValue = "5") Integer size,
                                            @RequestParam(defaultValue = "createdDate") String sortBy,
                                            @RequestParam(defaultValue = "desc") String sortDir) {
        return favoriteService.getFavorites(page, size, sortBy, sortDir);
    }
}
