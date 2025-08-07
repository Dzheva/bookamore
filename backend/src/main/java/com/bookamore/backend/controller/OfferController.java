package com.bookamore.backend.controller;

import com.bookamore.backend.dto.request.OfferRequest;
import com.bookamore.backend.dto.request.OfferWithBookRequest;
import com.bookamore.backend.dto.response.OfferResponse;
import com.bookamore.backend.dto.response.OfferWithBookResponse;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/offers")
public class OfferController {

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
        // TODO

        return Page.empty();
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
        // TODO

        return Page.empty();
    }

    @GetMapping("/{offerId}")
    public ResponseEntity<OfferResponse> getById(@PathVariable Long offerId) {

        // TODO
        return ResponseEntity.ok().build();
    }

    @GetMapping("/with-book/{offerId}")
    public ResponseEntity<OfferWithBookResponse> getWithBookById(@PathVariable Long offerId) {

        // TODO
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<OfferResponse> create(@RequestBody OfferRequest request) {
        // TODO
        return ResponseEntity.ok().build();
    }

    @PostMapping("/with-book")
    public ResponseEntity<OfferWithBookResponse> createWithBook(@RequestBody OfferWithBookRequest request) {
        // TODO
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/update/{offerId}")
    public ResponseEntity<OfferResponse> update(@PathVariable Long offerId,
                                                @RequestBody OfferRequest request) {

        // TODO
        return ResponseEntity.ok().build();
    }


    @PatchMapping("/with-book/update/{offerId}")
    public ResponseEntity<OfferWithBookResponse> updateWithBook(@PathVariable Long offerId,
                                                                @RequestBody OfferWithBookRequest request) {

        // TODO
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{offerId}")
    public ResponseEntity<Void> delete(@PathVariable Long offerId) {

        // TODO
        return ResponseEntity.ok().build();
    }
}
