package com.bookamore.backend.service;

import com.bookamore.backend.dto.mapper.BookMapper;
import com.bookamore.backend.dto.request.BookRequest;
import com.bookamore.backend.dto.response.BookResponse;
import com.bookamore.backend.entity.Book;
import com.bookamore.backend.entity.BookAuthor;
import com.bookamore.backend.entity.BookGenre;
import com.bookamore.backend.entity.BookImage;
import com.bookamore.backend.repository.BookAuthorRepository;
import com.bookamore.backend.repository.BookGenreRepository;
import com.bookamore.backend.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;
    private final BookGenreRepository bookGenreRepository;
    private final BookAuthorRepository bookAuthorRepository;
    private final BookMapper bookMapper;

//    public Book create(Book book) {
//        return bookRepository.save(book);
//    }

//    public BookResponse create(BookRequest bookRequest) {
//        Book book = bookMapper.toBook(bookRequest);
//
//        //List<BookGenre> genres = new ArrayList<>();
//
//        /*for (BookGenre g : book.getGenres()) {
//            this.bookGenreRepository.findByName(g.getName()).ifPresentOrElse(genres::add, () -> {
//                genres.add(g);
//            });
//        }
//        book.setGenres(genres);*/
//
//        // Condition
//
//        // Authors
//
//        // Images
//        book = bookRepository.save(book);
//        return bookMapper.toBookResponse(book);
//    }

    public BookResponse create(BookRequest bookRequest) {
        Book book = bookMapper.toBook(bookRequest);

        List<BookAuthor> managedAuthors = new ArrayList<>();
        for (String authorName : bookRequest.getAuthors()) {
            bookAuthorRepository.findByName(authorName).ifPresentOrElse(
                    managedAuthors::add,
                    () -> {
                        BookAuthor newAuthor = new BookAuthor();
                        newAuthor.setName(authorName);
                        managedAuthors.add(newAuthor);
                    }
            );
        }
        book.setAuthors(managedAuthors);

        List<BookGenre> managedGenres = new ArrayList<>();
        for (String genreName : bookRequest.getGenres()) {
            bookGenreRepository.findByName(genreName).ifPresentOrElse(
                    managedGenres::add,
                    () -> {
                        BookGenre newGenre = new BookGenre();
                        newGenre.setName(genreName);
                        managedGenres.add(newGenre);
                    }
            );
        }
        book.setGenres(managedGenres);

        List<BookImage> managedImages = new ArrayList<>();
        for (String imageUrl : bookRequest.getImages()) {
            BookImage newImage = new BookImage();
            newImage.setPath(imageUrl);
            newImage.setBook(book);
            managedImages.add(newImage);
        }
        book.setImages(managedImages);


        book = bookRepository.save(book);

        return bookMapper.toBookResponse(book);
    }


    public List<BookResponse> getAll() {
        return bookRepository.findAll().stream()
                .map(bookMapper::toBookResponse).collect(Collectors.toList());
    }

    public Page<Book> getPageable(Integer page, Integer size, String sortBy, String direction) {
        Sort sort = Sort.by(sortBy);

        if (direction.equals(Sort.Direction.ASC.name()))
            sort.ascending();
        else
            sort.descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return bookRepository.findAll(pageable);
    }

    public Optional<Book> getById(Long id) {
        return bookRepository.findById(id);
    }

    public void update(Book book) {
        bookRepository.save(book);
    }
}
