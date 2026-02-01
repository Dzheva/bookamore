package com.bookamore.backend.dto.offer;

import com.bookamore.backend.dto.book.BookRequest;
import com.bookamore.backend.entity.enums.OfferStatus;
import com.bookamore.backend.entity.enums.OfferType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class OfferWithBookRequest {

    @NotNull(message = "Offer type cannot be null.")
    @Schema(example = "SELL", description = "Type of the offer")
    private OfferType type;

    @NotNull(message = "Offer status cannot be null.")
    @Schema(example = "OPEN", description = "Status of the offer")
    private OfferStatus status;

    @Size(max = 500, message = "Description can be up to 500 characters.")
    @Schema(example = "Selling a first edition in great condition", description = "Description of the offer")
    private String offerDescription;

    @NotNull(message = "Price cannot be null.")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0.")
    @Schema(example = "19.99", description = "Price of the book")
    private BigDecimal price;

    @Valid
    @NotNull(message = "Book information must be provided.")
    @Schema(description = "Book details for the offer", implementation = BookRequest.class)
    private BookRequest book;

    @NotNull(message = "Seller ID cannot be null.")
    @Schema(example = "42", description = "ID of the seller (User)")
    private UUID sellerId;
}
