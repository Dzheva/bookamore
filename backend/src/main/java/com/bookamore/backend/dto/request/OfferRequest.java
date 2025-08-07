package com.bookamore.backend.dto.request;

import com.bookamore.backend.entity.enums.OfferStatus;
import com.bookamore.backend.entity.enums.OfferType;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class OfferRequest {
    private OfferType type;
    private OfferStatus status;
    private String description;
    private BigDecimal price;
    private String previewImage;
    private Long bookId;
    private Long sellerId;
}
