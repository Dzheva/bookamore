package com.bookamore.backend.service.impl;

import com.bookamore.backend.entity.Book;
import com.bookamore.backend.entity.BookImage;
import com.bookamore.backend.repository.BookAuthorRepository;
import com.bookamore.backend.repository.BookGenreRepository;
import com.bookamore.backend.repository.BookRepository;
import com.bookamore.backend.mapper.book.BookMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookServiceImplTest {

    @Mock
    private BookRepository bookRepository;
    @Mock
    private BookGenreRepository bookGenreRepository;
    @Mock
    private BookAuthorRepository bookAuthorRepository;
    @Mock
    private BookMapper bookMapper;

    @InjectMocks
    private BookServiceImpl bookService;

    @Test
    void removeImage_removesOnlyMatchingBookImage() {
        UUID bookId = UUID.randomUUID();
        String pathToRemove = "/img/book/removeMe.jpg";
        String pathToKeep = "/img/book/keepMe.jpg";

        Book book = new Book();
        BookImage removed = new BookImage();
        removed.setPath(pathToRemove);
        removed.setBook(book);
        BookImage kept = new BookImage();
        kept.setPath(pathToKeep);
        kept.setBook(book);
        book.getImages().add(removed);
        book.getImages().add(kept);

        when(bookRepository.findById(bookId)).thenReturn(Optional.of(book));
        when(bookRepository.save(any(Book.class))).thenReturn(book);

        bookService.removeImage(bookId, pathToRemove);

        assertThat(book.getImages())
                .extracting(BookImage::getPath)
                .containsExactly(pathToKeep);
        verify(bookRepository).save(book);
    }
}
