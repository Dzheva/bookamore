package com.bookamore.backend.controller;

import com.bookamore.backend.annotation.No401Swgr;
import com.bookamore.backend.annotation.No404Swgr;
import com.bookamore.backend.dto.offer.OfferRequest;
import com.bookamore.backend.dto.offer.OfferUpdateRequest;
import com.bookamore.backend.dto.offer.OfferWithBookRequest;
import com.bookamore.backend.dto.offer.OfferResponse;
import com.bookamore.backend.dto.offer.OfferWithBookResponse;
import com.bookamore.backend.service.OfferService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/offers")
@RequiredArgsConstructor
public class OfferController {

    private final OfferService offerService;

    @No401Swgr
    @No404Swgr
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get offers page", description = "Get offers page")
    public Page<OfferResponse> getOffersPage(@RequestParam(defaultValue = "0") Integer page,
                                             @RequestParam(defaultValue = "5") Integer size,
                                             @Parameter(
                                                     description = "Sort by field",
                                                     schema = @Schema(
                                                             allowableValues = {"id", "createdDate",
                                                                     "lastModifiedDate", "price", "type", "status",
                                                                     /*book fields*/
                                                                     "title", "yearOfRelease", "description",
                                                                     "condition", "authorName"}
                                                     )
                                             )
                                             @RequestParam(defaultValue = "createdDate") String sortBy,
                                             @Parameter(
                                                     description = "Sort direction: `asc` or `desc`",
                                                     schema = @Schema(allowableValues = {"asc", "desc"})
                                             )
                                             @RequestParam(defaultValue = "desc") String sortDir) {
        return offerService.getOffersPage(page, size, sortBy, sortDir);
    }

    @No401Swgr
    @No404Swgr
    @Operation(summary = "Get offers page with book fields", description = "Get offers page with book fields")
    @GetMapping("/with-book")
    @ResponseStatus(HttpStatus.OK)
    public Page<OfferWithBookResponse> getOffersWithBookPage(@RequestParam(defaultValue = "0") Integer page,
                                                             @RequestParam(defaultValue = "5") Integer size,
                                                             @Parameter(
                                                                     description = "Sort by field",
                                                                     schema = @Schema(
                                                                             allowableValues = {"id", "createdDate",
                                                                                     "lastModifiedDate", "price",
                                                                                     "type", "status",
                                                                                     /*book fields*/
                                                                                     "title", "yearOfRelease",
                                                                                     "description", "condition",
                                                                                     "authorName"}
                                                                     )
                                                             )
                                                             @RequestParam(defaultValue = "createdDate") String sortBy,
                                                             @Parameter(
                                                                     description = "Sort direction: `asc` or `desc`",
                                                                     schema = @Schema(allowableValues = {"asc", "desc"})
                                                             )
                                                             @RequestParam(defaultValue = "desc") String sortDir) {

        return offerService.getOffersWithBooksPage(page, size, sortBy, sortDir);
    }

    @No401Swgr
    @GetMapping("/{offerId}")
    @Operation(summary = "Get offer by id", description = "Get offer by id")
    public ResponseEntity<OfferResponse> getOfferById(@PathVariable Long offerId) {
        OfferResponse offer = offerService.getById(offerId);

        return offer != null ? ResponseEntity.ok(offer) : ResponseEntity.notFound().build();
    }

    @No401Swgr
    @Operation(summary = "Get offer by id with book fields", description = "Get offer by id with book fields")
    @GetMapping("/with-book/{offerId}")
    public ResponseEntity<OfferWithBookResponse> getOffersWithBookById(@PathVariable Long offerId) {

        OfferWithBookResponse offer = offerService.getWithBookById(offerId);

        return offer != null ? ResponseEntity.ok(offer) : ResponseEntity.notFound().build();
    }

    @Operation(summary = "Create offer", description = "Create offer")
    @PostMapping
    public ResponseEntity<OfferResponse> createOffer(@RequestBody OfferRequest request) {

        OfferResponse createdOffer = offerService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOffer);
    }

    @Operation(summary = "Create offer and its book", description = "Create offer and its book")
    @PostMapping("/with-book")
    public ResponseEntity<OfferWithBookResponse> createOfferWithBook(@RequestBody OfferWithBookRequest request) {

        OfferWithBookResponse createdOffer = offerService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOffer);
    }

    @Operation(summary = "Update offer", description = "Update offer fields")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Offer was updated successfully",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = OfferResponse.class)
                    )
            )
    })
    @PatchMapping("/{offerId}")
    public ResponseEntity<OfferResponse> updateOffer(@PathVariable Long offerId,
                                                     @RequestBody OfferUpdateRequest request) {

        return ResponseEntity.status(HttpStatus.OK).body(offerService.update(offerId, request));
    }

    @Operation(summary = "Delete offer by ID", description = "Delete offer by id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Book was deleted successfully")
    })
    @DeleteMapping("/{offerId}")
    public ResponseEntity<Void> deleteOffer(@PathVariable Long offerId) {

        offerService.delete(offerId);
        return ResponseEntity.noContent().build();
    }
}
