package com.bookamore.backend.dto.mapper;

import com.bookamore.backend.dto.request.BookRequest;
import com.bookamore.backend.dto.response.BookResponse;
import com.bookamore.backend.entity.*;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class BookMapper {

    public BookResponse toBookResponse(Book book) {

        List<String> authors = book.getAuthors() != null
                ? book.getAuthors().stream().map(BookAuthor::getName).toList()
                : null;

        List<String> genres = book.getGenres() != null
                ? book.getGenres().stream().map(BookGenre::getName).toList()
                : null;

        List<String> images = book.getImages() != null
                ? book.getImages().stream().map(BookImage::getPath).toList()
                : null;

        String condition = book.getCondition() != null ? book.getCondition().getName() : null;

        return new BookResponse(
                book.getId(),
                book.getTitle(),
                authors,
                new BigDecimal("0.0"),  // TODO replace with Offer.price value
                condition,
                genres,
                "sell", // TODO replace with Offer.type value
                book.getIsbn(),
                images,
                book.getDescription()
        );
    }

    public Book toBook(BookRequest bookRequest) {
        Book book = new Book();

        book.setTitle(bookRequest.getTitle());
        book.setDescription(bookRequest.getDescription());
        book.setIsbn(bookRequest.getIsbn());
        book.setCondition(new BookCondition(bookRequest.getCondition()));
        book.setAuthors(bookRequest.getAuthors().stream().map(BookAuthor::new).toList());
        book.setGenres(bookRequest.getGenres().stream().map(BookGenre::new).toList());
        List<BookImage> bookImages = new ArrayList<>();
        for (String imagePath : bookRequest.getImages()){
            BookImage image = new BookImage();
            image.setPath(imagePath);
            image.setBook(book);
        }
        book.setImages(bookImages);

        return book;
    }
}
