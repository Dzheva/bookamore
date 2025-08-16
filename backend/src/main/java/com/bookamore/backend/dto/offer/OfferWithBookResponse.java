package com.bookamore.backend.dto.response;

import com.bookamore.backend.entity.enums.OfferStatus;
import com.bookamore.backend.entity.enums.OfferType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfferWithBookResponse {

    private Long id;
    private OfferType type;
    private OfferStatus status;
    private String description;
    private BigDecimal price;
    private String previewImage;

    private BookResponse book;

    private Long sellerId;

}
