package com.bookamore.backend.controller;

import com.bookamore.backend.dto.request.BookRequest;
import com.bookamore.backend.dto.response.BookResponse;
import com.bookamore.backend.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Page<BookResponse> getPageAllBooks(@RequestParam(defaultValue = "0") Integer page,
                                              @RequestParam(defaultValue = "5") Integer size,
                                              @RequestParam(defaultValue = "createdDate") String sortBy,
                                              @RequestParam(defaultValue = "desc") String sortDir) {
        return bookService.getPageAllBooks(page, size, sortBy, sortDir);
    }

    @GetMapping("/{bookId}")
    public ResponseEntity<BookResponse> getBookById(@PathVariable Long bookId) {
        BookResponse book = bookService.getById(bookId);

        return book != null ? ResponseEntity.ok(book) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<BookResponse> createBook(@RequestBody BookRequest bookRequest) {
        // TODO Unauthorized

        BookResponse createdBook = bookService.create(bookRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBook);
    }

    @PostMapping("/list")
    public ResponseEntity<List<BookResponse>> createBookList(@RequestBody List<BookRequest> bookRequestList) {
        // TODO Unauthorized

        List<BookResponse> createdBooks = bookService.createList(bookRequestList);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBooks);
    }

    @PatchMapping("/update/{bookId}")
    public ResponseEntity<BookResponse> updateBook(@PathVariable Long bookId,
                                                   @RequestBody BookRequest bookRequest) {
        return bookService.update(bookId, bookRequest)
                .map(updatedBook -> ResponseEntity.status(HttpStatus.OK).body(updatedBook))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/delete/{bookId}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long bookId) {
        return bookService.delete(bookId) ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}
