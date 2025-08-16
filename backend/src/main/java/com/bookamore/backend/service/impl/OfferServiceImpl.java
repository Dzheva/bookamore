package com.bookamore.backend.service.impl;

import com.bookamore.backend.dto.mapper.offer.OfferMapper;
import com.bookamore.backend.dto.request.BookRequest;
import com.bookamore.backend.dto.request.OfferRequest;
import com.bookamore.backend.dto.request.OfferUpdateRequest;
import com.bookamore.backend.dto.request.OfferWithBookRequest;
import com.bookamore.backend.dto.response.OfferResponse;
import com.bookamore.backend.dto.response.OfferWithBookResponse;
import com.bookamore.backend.entity.Book;
import com.bookamore.backend.entity.Offer;
import com.bookamore.backend.entity.User;
import com.bookamore.backend.entity.enums.OfferStatus;
import com.bookamore.backend.entity.enums.OfferType;
import com.bookamore.backend.exception.ResourceNotFoundException;
import com.bookamore.backend.repository.BookRepository;
import com.bookamore.backend.repository.OfferRepository;
import com.bookamore.backend.repository.UserRepository;
import com.bookamore.backend.repository.spec.BookSpecifications;
import com.bookamore.backend.repository.spec.OfferSpecification;
import com.bookamore.backend.service.BookService;
import com.bookamore.backend.service.OfferService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class OfferServiceImpl implements OfferService {

    private final OfferRepository offerRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    private final BookService bookService;

    private final OfferMapper offerMapper;

    private static final Set<String> BOOK_FIELDS = Set.of(
            "title", "yearOfRelease", "description", "condition", "authorName"
    );

    @Transactional
    public OfferResponse create(OfferRequest request) {
        Long bookId = Optional.ofNullable(request.getBookId())
                .orElseThrow(() -> new IllegalArgumentException("Provided OfferRequest with bookId = null"));

        Long sellerId = Optional.ofNullable(request.getSellerId())
                .orElseThrow(() -> new IllegalArgumentException("Provided OfferRequest with sellerId = null"));

        Book book = bookRepository.findById(bookId).orElseThrow(
                () -> new ResourceNotFoundException(String.format("Book not found with id: %d. Please, ensure the book exists before this operation", bookId))
        );

        User user = userRepository.findById(sellerId).orElseThrow(
                () -> new ResourceNotFoundException(String.format("User not found with id: %d. Please, ensure the user exists before this operation", sellerId))
        );

        Offer offer = offerMapper.toEntity(request);
        offer.setBook(book);
        offer.setUser(user);
        offer = offerRepository.save(offer);
        return offerMapper.toResponse(offer);
    }

    @Transactional
    public OfferWithBookResponse create(OfferWithBookRequest request) {
        BookRequest bookRequest = request.getBook();
        Book savedBook = bookService.createBook(bookRequest);

        Offer offer = offerMapper.toEntity(request);
        offer.setBook(savedBook);
        offer = offerRepository.save(offer);

        return offerMapper.toResponseWithBook(offer);
    }

    public Page<Offer> getOffersEntityPage(Integer page, Integer size, String sortBy, String sortDir) {

        if (isBookField(sortBy)) {
            return getOffersPageSortedByBookField(page, size, sortBy, sortDir);
        }

        Sort.Direction direction = Sort.Direction.fromString(sortDir);
        Sort sort = Sort.by(direction, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return offerRepository.findAll(pageable);
    }

    private boolean isBookField(String field) {
        return BOOK_FIELDS.contains(field);
    }

    private Page<Offer> getOffersPageSortedByBookField(Integer page, Integer size, String sortBy, String sortDir) {

        Sort.Direction direction = Sort.Direction.fromString(sortDir);

        if (sortBy.equals("authorName")) {
            return offerRepository.findAll(
                    OfferSpecification.sortByBookAuthorName(direction),
                    PageRequest.of(page, size)
            );
        }

        return offerRepository.findAll(
                OfferSpecification.sortByBookSimpleFieldCaseSensitive(direction, sortBy),
                PageRequest.of(page, size)
        );
    }

    public Page<OfferResponse> getOffersPage(Integer page, Integer size, String sortBy, String sortDir) {
        return getOffersEntityPage(page, size, sortBy, sortDir).map(offerMapper::toResponse);
    }

    public Page<OfferWithBookResponse> getOffersWithBooksPage(Integer page, Integer size,
                                                              String sortBy, String sortDir) {
        return getOffersEntityPage(page, size, sortBy, sortDir).map(offerMapper::toResponseWithBook);
    }

    public Offer getEntityById(Long offerId) {
        return offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found with id: " + offerId));
    }

    public OfferResponse getById(Long offerId) {
        return offerMapper.toResponse(getEntityById(offerId));
    }

    public OfferWithBookResponse getWithBookById(Long offerId) {
        return offerMapper.toResponseWithBook(getEntityById(offerId));
    }

    @Transactional
    public OfferResponse update(Long offerId, OfferUpdateRequest request) {

        Offer existingOffer = offerRepository.findById(offerId).orElseThrow(
                () -> new ResourceNotFoundException("Offer not found with id: " + offerId)
        );

        Offer patch = offerMapper.toEntity(request);

        boolean isModified = updateSimpleFields(existingOffer, patch);

        if (isModified) {
            Offer savedOffer = offerRepository.save(existingOffer);  // save modified offer
            return offerMapper.toResponse(savedOffer);
        }
        return offerMapper.toResponse(existingOffer);
    }

    private boolean updateSimpleFields(Offer existingOffer, Offer patch) {
        // Patch Fields
        String patchDescription = patch.getDescription();
        BigDecimal patchPrice = patch.getPrice();
        String patchPreviewImage = patch.getPreviewImage();
        OfferType patchType = patch.getType();
        OfferStatus patchStatus = patch.getStatus();

        // Fields to update
        String description = existingOffer.getDescription();
        BigDecimal price = existingOffer.getPrice();
        String previewImage = existingOffer.getPreviewImage();
        OfferType type = existingOffer.getType();
        OfferStatus status = existingOffer.getStatus();

        boolean isModified = false;

        if (patchDescription != null && !patchDescription.equals(description)) {
            existingOffer.setDescription(patchDescription);
            isModified = true;
        }

        if (patchPrice != null && !patchPrice.equals(price)) {
            existingOffer.setPrice(patchPrice);
            isModified = true;
        }

        if (patchPreviewImage != null && !patchPreviewImage.equals(previewImage)) {
            existingOffer.setPreviewImage(patchPreviewImage);
            isModified = true;
        }

        if (patchType != null && !patchType.equals(type)) {
            existingOffer.setType(patchType);
            isModified = true;
        }

        if (patchStatus != null && !patchStatus.equals(status)) {
            existingOffer.setStatus(patchStatus);
            isModified = true;
        }

        return isModified;
    }

    @Transactional
    public void delete(Long offerId) {
        Offer offer = offerRepository.findById(offerId).orElseThrow(
                () -> new ResourceNotFoundException("Offer not found with id: " + offerId)
        );
        offerRepository.delete(offer);
    }
}
