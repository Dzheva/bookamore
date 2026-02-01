package com.bookamore.backend.dto.offer;

import com.bookamore.backend.dto.book.BookResponse;
import com.bookamore.backend.entity.enums.OfferStatus;
import com.bookamore.backend.entity.enums.OfferType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfferWithBookResponse {

    private UUID id;
    private OfferType type;
    private OfferStatus status;
    private String description;
    private BigDecimal price;
    private String previewImage;

    private BookResponse book;

    private UUID sellerId;

}
