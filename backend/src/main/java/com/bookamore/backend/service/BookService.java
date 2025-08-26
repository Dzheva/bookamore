package com.bookamore.backend.service;

import com.bookamore.backend.dto.book.BookRequest;
import com.bookamore.backend.dto.book.BookResponse;
import com.bookamore.backend.entity.Book;
import org.springframework.data.domain.Page;

import java.util.List;

public interface BookService {

    Book createBook(BookRequest bookRequest);

    BookResponse create(BookRequest bookRequest);

/*    List<BookResponse> createList(List<BookRequest> bookRequestList);

    List<BookResponse> getAll();

    Page<BookResponse> getBooksPage(Integer page, Integer size, String sortBy, String sortDir);*/

    Book getBookEntityById(Long bookId);

    BookResponse getById(Long bookId);

    BookResponse update(Long bookId, BookRequest bookRequest);

    void delete(Long bookId);

}
