package com.bookamore.backend.dto.offer;

import com.bookamore.backend.entity.enums.OfferStatus;
import com.bookamore.backend.entity.enums.OfferType;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfferResponse {
    private UUID id;
    private OfferType type;
    private OfferStatus status;
    private String description;
    private BigDecimal price;
    private UUID bookId;
    private Seller seller;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("isFavorite")
    private Boolean favorite;
}
