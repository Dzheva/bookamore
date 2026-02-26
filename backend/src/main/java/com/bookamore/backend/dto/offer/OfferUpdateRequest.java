package com.bookamore.backend.dto.offer;

import com.bookamore.backend.entity.enums.OfferStatus;
import com.bookamore.backend.entity.enums.OfferType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class OfferUpdateRequest {

    @Schema(example = "SELL", description = "Type of the offer")
    private OfferType type;

    @Schema(example = "OPEN", description = "Status of the offer")
    private OfferStatus status;

    @Size(max = 500, message = "Description can be up to 500 characters.")
    @Schema(example = "Selling a first edition in great condition", description = "Description of the offer")
    private String description;

    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0.")
    @Schema(example = "19.99", description = "Price of the book")
    private BigDecimal price;
}
