package com.bookamore.backend.dto.request;

import com.bookamore.backend.entity.enums.OfferStatus;
import com.bookamore.backend.entity.enums.OfferType;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class OfferWithBookRequest {
    // Offer fields
    private OfferType type;
    private OfferStatus status;
    private String offerDescription;
    private BigDecimal price;
    private String previewImage;

    // Book fields
    private String title;
    private List<String> authors;
    private String condition;
    private List<String> genres;
    private String isbn;
    private List<String> images;
    private Integer yearOfRelease;
    private String description;

    private Long sellerId;
}
