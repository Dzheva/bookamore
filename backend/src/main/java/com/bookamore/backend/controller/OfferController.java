package com.bookamore.backend.controller;

import com.bookamore.backend.dto.request.OfferRequest;
import com.bookamore.backend.dto.request.OfferUpdateRequest;
import com.bookamore.backend.dto.request.OfferWithBookRequest;
import com.bookamore.backend.dto.response.OfferResponse;
import com.bookamore.backend.dto.response.OfferWithBookResponse;
import com.bookamore.backend.service.OfferService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.mapstruct.Context;
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

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
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

    @GetMapping("/{offerId}")
    public ResponseEntity<OfferResponse> getOfferById(@PathVariable Long offerId) {
        OfferResponse offer = offerService.getById(offerId);

        return offer != null ? ResponseEntity.ok(offer) : ResponseEntity.notFound().build();
    }

    @GetMapping("/with-book/{offerId}")
    public ResponseEntity<OfferWithBookResponse> getOffersWithBookById(@PathVariable Long offerId) {

        OfferWithBookResponse offer = offerService.getWithBookById(offerId);

        return offer != null ? ResponseEntity.ok(offer) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<OfferResponse> createOffer(@RequestBody OfferRequest request) {

        // TODO Unauthorized

        OfferResponse createdOffer = offerService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOffer);
    }

    @PostMapping("/with-book")
    public ResponseEntity<OfferWithBookResponse> createOfferWithBook(@RequestBody OfferWithBookRequest request) {

        // TODO Unauthorized

        OfferWithBookResponse createdOffer = offerService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOffer);
    }

    /*@Operation(summary = "Update offer", description = "Update offer fields")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Offer was updated successfully",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = OfferResponse.class)
                    )
            )
    })*/
    @PatchMapping("/update/{offerId}")
    public ResponseEntity<OfferResponse> updateOffer(@PathVariable Long offerId,
                                                     @RequestBody OfferUpdateRequest request) {

        // TODO Unauthorized

        return ResponseEntity.status(HttpStatus.OK).body(offerService.update(offerId, request));
    }

    /*@Operation(summary = "Delete offer by ID", description = "Delete offer by id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Book was deleted successfully")
    })*/
    @DeleteMapping("/delete/{offerId}")
    public ResponseEntity<Void> deleteOffer(@PathVariable Long offerId) {

        // TODO Unauthorized

        offerService.delete(offerId);
        return ResponseEntity.noContent().build();
    }
}
