package com.bookamore.backend.controller;

import com.bookamore.backend.annotation.No401Swgr;
import com.bookamore.backend.dto.book.BookResponse;
import com.bookamore.backend.dto.book.BookUpdateRequest;
import com.bookamore.backend.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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

    /*
     * Book image controller
     */

    @Operation(summary = "Save book images",
            description = "The method will attempt to add all provided images." +
                    "If the entity has already reached or will exceed the maximum " +
                    "allowed number of images (4), the operation will be aborted.")
    @PatchMapping(value = "/{bookId}/saveImages", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<List<String>> saveManyImages(@PathVariable Long bookId,
                                                       @RequestBody List<MultipartFile> images) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookService.saveImages(bookId, images));
    }

    @Operation(summary = "Replace book images",
            description = "Replaces existing images associated with the Book. " +
                    "All current images will be removed and replaced with the provided ones.")
    @PutMapping(value = "/{bookId}/replaceImages", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<List<String>> replaceManyImages(@PathVariable Long bookId,
                                                          @RequestBody List<MultipartFile> images) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookService.replaceImages(bookId, images));
    }

    @Operation(summary = "Delete book image", description = "Delete one book image")
    @DeleteMapping("/{bookId}/deleteImage")
    public ResponseEntity<Void> deleteImage(@PathVariable Long bookId, @RequestParam String imagePath) {
        bookService.deleteImage(bookId, imagePath);
        return ResponseEntity.noContent().build();
    }
}
