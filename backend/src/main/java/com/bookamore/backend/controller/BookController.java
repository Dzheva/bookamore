package com.bookamore.backend.controller;

import com.bookamore.backend.dto.book.BookRequest;
import com.bookamore.backend.dto.book.BookResponse;
import com.bookamore.backend.service.BookService;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
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

    /*@Operation(summary = "Get books page")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Book created successfully"
            )
    })*/
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Page<BookResponse> getBooksPage(@RequestParam(defaultValue = "0") Integer page,
                                           @RequestParam(defaultValue = "5") Integer size,
                                           @Parameter(
                                                   description = "Sort by field",
                                                   schema = @Schema(
                                                           allowableValues = {"id", "createdDate",
                                                                   "lastModifiedDate", "title", "yearOfRelease",
                                                                   "description", "isbn", "condition", "authorName"}
                                                   )
                                           )
                                           @RequestParam(defaultValue = "createdDate") String sortBy,
                                           @Parameter(
                                                   description = "Sort direction: `asc` or `desc`",
                                                   schema = @Schema(allowableValues = {"asc", "desc"})
                                           )
                                           @RequestParam(defaultValue = "desc") String sortDir) {
        return bookService.getBooksPage(page, size, sortBy, sortDir);
    }

    /*@Operation(summary = "Get book by ID")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Book created successfully",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = BookResponse.class)
                    )
            )
    })*/
    @GetMapping("/{bookId}")
    public ResponseEntity<BookResponse> getBookById(@PathVariable Long bookId) {
        BookResponse book = bookService.getById(bookId);

        return book != null ? ResponseEntity.ok(book) : ResponseEntity.notFound().build();
    }


    /*@Operation(summary = "Create book", description = "Create a new book using BookRequest schema fields.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Book created successfully",
                    content = @Content(schema = @Schema(implementation = BookResponse.class))
            )
    })*/
    @PostMapping
    public ResponseEntity<BookResponse> createBook(@RequestBody BookRequest bookRequest) {
        // TODO Unauthorized

        BookResponse createdBook = bookService.create(bookRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBook);
    }

    /*@Operation(summary = "Create a list of books", description = "Redundant method used to testing API only. Remove after MVP.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Book list created successfully",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = BookResponse.class)
                    )
            )
    })*/
    @PostMapping("/list")
    public ResponseEntity<List<BookResponse>> createBookList(@RequestBody List<BookRequest> bookRequestList) {
        // TODO Unauthorized

        List<BookResponse> createdBooks = bookService.createList(bookRequestList);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBooks);
    }

    /*@Operation(summary = "Update book", description = "PATCH endpoint for book resource updates. " +
            "Supports partial updates using BookRequest schema fields.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Book updated or already matches request parameters",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = BookResponse.class)
                    )
            )
    })*/
    @PatchMapping("/update/{bookId}")
    public ResponseEntity<BookResponse> updateBook(@PathVariable Long bookId,
                                                   @RequestBody BookRequest bookRequest) {
        // TODO Unauthorized

        return ResponseEntity.status(HttpStatus.OK).body(bookService.update(bookId, bookRequest));
    }


    /*@Operation(summary = "Delete book by ID", description = "Deletes a book resource. " +
            "Note: Book must not have associated offers (delete offer first)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Book was deleted successfully")
    })*/
    @DeleteMapping("/delete/{bookId}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long bookId) {
        // TODO Unauthorized

        bookService.delete(bookId);
        return ResponseEntity.noContent().build();
    }
}
