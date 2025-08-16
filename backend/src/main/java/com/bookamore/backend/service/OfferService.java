package com.bookamore.backend.service;

import com.bookamore.backend.dto.offer.OfferRequest;
import com.bookamore.backend.dto.offer.OfferUpdateRequest;
import com.bookamore.backend.dto.offer.OfferWithBookRequest;
import com.bookamore.backend.dto.offer.OfferResponse;
import com.bookamore.backend.dto.offer.OfferWithBookResponse;
import com.bookamore.backend.entity.Offer;
import org.springframework.data.domain.Page;


public interface OfferService {

    OfferResponse create(OfferRequest request);

    OfferWithBookResponse create(OfferWithBookRequest request);

    Page<Offer> getOffersEntityPage(Integer page, Integer size, String sortBy, String sortDir);

    Page<OfferResponse> getOffersPage(Integer page, Integer size, String sortBy, String sortDir);

    Page<OfferWithBookResponse> getOffersWithBooksPage(Integer page, Integer size, String sortBy, String sortDir);

    Offer getEntityById(Long offerId);

    OfferResponse getById(Long offerId);

    OfferWithBookResponse getWithBookById(Long offerId);

    OfferResponse update(Long offerId, OfferUpdateRequest request);

    void delete(Long offerId);
}
