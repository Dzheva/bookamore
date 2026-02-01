package com.bookamore.backend.service;

import com.bookamore.backend.dto.book.BookRequest;
import com.bookamore.backend.dto.book.BookResponse;
import com.bookamore.backend.dto.book.BookUpdateRequest;
import com.bookamore.backend.entity.Book;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface BookService {

    Book createBook(BookRequest bookRequest);

    BookResponse create(BookRequest bookRequest);

    Book getBookEntityById(UUID bookId);

    BookResponse getById(UUID bookId);

    BookResponse update(UUID bookId, BookUpdateRequest bookRequest);

    /*
     * Book Images Service Part
     */

    List<String> saveImages(UUID bookId, List<MultipartFile> images);

    List<String> replaceImages(UUID bookId, List<MultipartFile> images);

    void deleteImage(UUID bookId, String imagePath);

}
