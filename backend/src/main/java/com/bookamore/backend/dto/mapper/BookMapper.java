package com.bookamore.backend.dto.mapper;

import com.bookamore.backend.dto.request.BookRequest;
import com.bookamore.backend.dto.response.BookResponse;
import com.bookamore.backend.entity.Book;
import com.bookamore.backend.entity.BookAuthor;
import com.bookamore.backend.entity.BookGenre;
import com.bookamore.backend.entity.BookImage;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class BookMapper {

    public BookResponse toBookResponse(Book book) {
        List<String> authors = book.getAuthors().stream()
                .map(BookAuthor::getName)
                .collect(Collectors.toList());


        List<String> genres = book.getGenres().stream()
                .map(BookGenre::getName)
                .collect(Collectors.toList());

        List<String> images = book.getImages().stream()
                .map(BookImage::getPath)
                .collect(Collectors.toList());

        return new BookResponse(
                book.getId(),
                book.getTitle(),
                authors,
                new BigDecimal("0.01"),  // TODO replace with Offer.price value
                book.getBookCondition(),
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
        book.setBookCondition(bookRequest.getCondition());
        book.setAuthors(bookRequest.getAuthors().stream().map(BookAuthor::new).toList());
        book.setGenres(bookRequest.getGenres().stream().map(BookGenre::new).toList());
        List<BookImage> bookImages = new ArrayList<>();
        for (String imagePath : bookRequest.getImages()) {
            BookImage image = new BookImage();
            image.setPath(imagePath);
            image.setBook(book);
        }
        book.setImages(bookImages);

        return book;
    }
}
