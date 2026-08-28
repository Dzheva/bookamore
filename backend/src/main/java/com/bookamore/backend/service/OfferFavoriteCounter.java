package com.bookamore.backend.service;

import com.bookamore.backend.dto.offer.OfferResponse;
import com.bookamore.backend.dto.offer.OfferWithBookResponse;
import org.springframework.data.domain.Page;

public interface OfferFavoriteCounter {
    Page<OfferResponse> count(Page<OfferResponse> page);

    OfferResponse count(OfferResponse response);

    Page<OfferWithBookResponse> countWithBook(Page<OfferWithBookResponse> page);

    OfferWithBookResponse countWithBook(OfferWithBookResponse response);
}
