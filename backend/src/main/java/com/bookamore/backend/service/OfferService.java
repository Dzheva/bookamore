package com.bookamore.backend.service;

import com.bookamore.backend.dto.offer.OfferRequest;
import com.bookamore.backend.dto.offer.OfferUpdateRequest;
import com.bookamore.backend.dto.offer.OfferWithBookRequest;
import com.bookamore.backend.dto.offer.OfferResponse;
import com.bookamore.backend.dto.offer.OfferWithBookResponse;
import com.bookamore.backend.entity.Offer;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;


public interface OfferService {

    OfferResponse create(OfferRequest request);

    OfferWithBookResponse create(OfferWithBookRequest request);

    Page<Offer> getOffersEntityPage(Integer page, Integer size, String sortBy, String sortDir);

    Page<OfferResponse> getOffersPage(Integer page, Integer size, String sortBy, String sortDir);

    Page<OfferWithBookResponse> getOffersWithBooksPage(Integer page, Integer size, String sortBy, String sortDir);

    Offer getEntityById(UUID offerId);

    OfferResponse getById(UUID offerId);

    OfferWithBookResponse getWithBookById(UUID offerId);

    OfferResponse update(UUID offerId, OfferUpdateRequest request);

    void delete(UUID offerId);

    String savePreviewImage(UUID offerId, MultipartFile previewImage);

    void deletePreviewImage(UUID offerId);
}
