package com.bookamore.backend.controller;

import com.bookamore.backend.annotation.No401Swgr;
import com.bookamore.backend.dto.book.BookRequest;
import com.bookamore.backend.dto.book.BookResponse;
import com.bookamore.backend.dto.book.BookUpdateRequest;
import com.bookamore.backend.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @Operation(summary = "Get book by ID")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Book created successfully",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = BookResponse.class)
                    )
            )
    })
    @GetMapping("/{bookId}")
    @No401Swgr
    public ResponseEntity<BookResponse> getBookById(@PathVariable Long bookId) {
        BookResponse book = bookService.getById(bookId);

        return book != null ? ResponseEntity.ok(book) : ResponseEntity.notFound().build();
    }


    @Operation(summary = "Update book", description = "PATCH endpoint for book resource updates. " +
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
    })
    @PatchMapping("/{bookId}")
    public ResponseEntity<BookResponse> updateBook(@PathVariable Long bookId,
                                                   @RequestBody BookUpdateRequest bookUpdateRequest) {
        return ResponseEntity.status(HttpStatus.OK).body(bookService.update(bookId, bookUpdateRequest));
    }

}
