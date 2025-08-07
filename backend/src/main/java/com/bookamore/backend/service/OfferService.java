package com.bookamore.backend.service;

import com.bookamore.backend.dto.mapper.offer.OfferMapper;
import com.bookamore.backend.dto.request.OfferRequest;
import com.bookamore.backend.dto.response.OfferResponse;
import com.bookamore.backend.entity.Book;
import com.bookamore.backend.entity.Offer;
import com.bookamore.backend.entity.User;
import com.bookamore.backend.repository.BookRepository;
import com.bookamore.backend.repository.OfferRepository;
import com.bookamore.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OfferService {

    private final OfferRepository offerRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    private final OfferMapper offerMapper;

    @Transactional
    public OfferResponse create(OfferRequest request) {
        Long bookId = Optional.ofNullable(request.getBookId())
                .orElseThrow(() -> new IllegalArgumentException("Provided OfferRequest with bookId = null"));

        Long sellerId = Optional.ofNullable(request.getSellerId())
                .orElseThrow(() -> new IllegalArgumentException("Provided OfferRequest with sellerId = null"));

        Book book = bookRepository.findById(bookId).orElseThrow(
                () -> new EntityNotFoundException(String.format("Book not found with id: %d. Please, ensure the book exists before this operation", bookId))
        );

        User user = userRepository.findById(sellerId).orElseThrow(
                () -> new EntityNotFoundException(String.format("User not found with id: %d. Please, ensure the user exists before this operation", sellerId))
        );

        Offer offer = offerMapper.toEntity(request);
        offer.setBook(book);
        offer.setUser(user);
        offer = offerRepository.save(offer);
        return offerMapper.toResponse(offer);
    }

    public void getPageAllBooks() {

    }

    public void getById() {

    }

    @Transactional
    public void update() {

    }

    @Transactional
    public void delete() {

    }
}
