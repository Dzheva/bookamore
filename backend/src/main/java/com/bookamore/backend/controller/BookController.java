package com.bookamore.backend.controller;

import com.bookamore.backend.dto.request.BookRequest;
import com.bookamore.backend.dto.response.BookResponse;
import com.bookamore.backend.entity.*;
import com.bookamore.backend.service.BookService;
import org.eclipse.angus.mail.iap.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("book/")
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping
    public List<BookResponse> getAllBooks() {
        return bookService.getAll();
    }

    @GetMapping("test_new_book")
    public String getTestBook() {

        BookAuthor a = new BookAuthor();
        a.setName("John");
        BookCondition c = new BookCondition();
        c.setName("new");
        BookGenre g = new BookGenre();
        g.setName("Super_Genre");
        BookImage i = new BookImage();
        i.setPath("/books/img/1.png");

        Book book = new Book();
        book.setAuthors(List.of(a));
        book.setIsbn("978-3-16-148410-0");
        book.setCondition(c);
        book.setGenres(List.of(g));
        book.setTitle("Some_Book");
        book.setDescription("A very interesting book, I swear.");
        book.setImages(List.of(i));
        i.setBook(book);

        System.out.println(book.getId());

        bookService.create(book);



        return "Success!";
    }

    @PostMapping
    public ResponseEntity<BookResponse> createBook(@RequestBody BookRequest bookRequest){
        // TODO Unauthorized

        BookResponse createdBook = bookService.create(bookRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBook);
    }
}
