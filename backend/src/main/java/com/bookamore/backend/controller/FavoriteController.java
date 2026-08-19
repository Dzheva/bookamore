package com.bookamore.backend.controller;

import com.bookamore.backend.annotation.No404Swgr;
import com.bookamore.backend.dto.offer.OfferResponse;
import com.bookamore.backend.service.FavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
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

    @Operation(summary = "Add offer to favorites",
            description = "Saves the offer to the authenticated user's favorites.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Offer was added to favorites"),
            @ApiResponse(responseCode = "404", description = "Offer not found")
    })
    @PostMapping("/{offerId}")
    public ResponseEntity<Void> addToFavorites(@PathVariable UUID offerId) {
        favoriteService.addToFavorites(offerId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @No404Swgr
    @Operation(summary = "Remove offer from favorites",
            description = "Removes the offer from the authenticated user's favorites.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Offer was removed from favorites")
    })
    @DeleteMapping("/{offerId}")
    public ResponseEntity<Void> removeFromFavorites(@PathVariable UUID offerId) {
        favoriteService.removeFromFavorites(offerId);
        return ResponseEntity.noContent().build();
    }

    @No404Swgr
    @Operation(summary = "Get current user favorites",
            description = "Returns a page of offers saved by the authenticated user. Same response type as GET /api/v1/offers.")
    @GetMapping
    public Page<OfferResponse> getFavorites(@RequestParam(defaultValue = "0") Integer page,
                                            @RequestParam(defaultValue = "5") Integer size,
                                            @Parameter(
                                                    description = "Sort by field",
                                                    schema = @Schema(
                                                            allowableValues = {"id", "createdDate",
                                                                    "lastModifiedDate", "price", "type", "status"}
                                                    )
                                            )
                                            @RequestParam(defaultValue = "createdDate") String sortBy,
                                            @Parameter(
                                                    description = "Sort direction: `asc` or `desc`",
                                                    schema = @Schema(allowableValues = {"asc", "desc"})
                                            )
                                            @RequestParam(defaultValue = "desc") String sortDir) {
        return favoriteService.getFavorites(page, size, sortBy, sortDir);
    }

    @Operation(summary = "Get favorites by user id",
            description = "Returns a page of offers saved by the specified user. Same response type as GET /api/v1/offers.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/{userId}")
    public Page<OfferResponse> getFavoritesByUserId(@PathVariable UUID userId,
                                                    @RequestParam(defaultValue = "0") Integer page,
                                                    @RequestParam(defaultValue = "5") Integer size,
                                                    @Parameter(
                                                            description = "Sort by field",
                                                            schema = @Schema(
                                                                    allowableValues = {"id", "createdDate",
                                                                            "lastModifiedDate", "price", "type", "status"}
                                                            )
                                                    )
                                                    @RequestParam(defaultValue = "createdDate") String sortBy,
                                                    @Parameter(
                                                            description = "Sort direction: `asc` or `desc`",
                                                            schema = @Schema(allowableValues = {"asc", "desc"})
                                                    )
                                                    @RequestParam(defaultValue = "desc") String sortDir) {
        return favoriteService.getFavorites(userId, page, size, sortBy, sortDir);
    }
}
