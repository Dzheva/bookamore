package com.bookamore.backend.service;

import com.bookamore.backend.dto.book.BookRequest;
import com.bookamore.backend.dto.book.BookResponse;
import com.bookamore.backend.dto.book.BookUpdateRequest;
import com.bookamore.backend.entity.Book;

public interface BookService {

    Book createBook(BookRequest bookRequest);

    BookResponse create(BookRequest bookRequest);

    Book getBookEntityById(Long bookId);

    BookResponse getById(Long bookId);

    BookResponse update(Long bookId, BookUpdateRequest bookRequest);

}
