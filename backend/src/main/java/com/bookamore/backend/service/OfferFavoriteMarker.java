package com.bookamore.backend.service;

import com.bookamore.backend.dto.offer.OfferResponse;
import com.bookamore.backend.dto.offer.OfferWithBookResponse;
import org.springframework.data.domain.Page;

public interface OfferFavoriteMarker {
    Page<OfferResponse> mark(Page<OfferResponse> page);

    OfferResponse mark(OfferResponse response);

    Page<OfferWithBookResponse> markWithBook(Page<OfferWithBookResponse> page);

    OfferWithBookResponse markWithBook(OfferWithBookResponse response);
}
