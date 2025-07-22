package com.bookamore.backend.service;

import com.bookamore.backend.dto.mapper.BookMapper;
import com.bookamore.backend.dto.request.BookRequest;
import com.bookamore.backend.dto.response.BookResponse;
import com.bookamore.backend.entity.Book;
import com.bookamore.backend.entity.BookGenre;
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
    private final BookMapper bookMapper;

    public Book create(Book book) {
        return this.bookRepository.save(book);
    }

    public BookResponse create(BookRequest bookRequest) {
        Book book = bookMapper.toBook(bookRequest);

        //List<BookGenre> genres = new ArrayList<>();

        /*for (BookGenre g : book.getGenres()) {
            this.bookGenreRepository.findByName(g.getName()).ifPresentOrElse(genres::add, () -> {
                genres.add(g);
            });
        }
        book.setGenres(genres);*/

        // Condition

        // Authors

        // Images
        book = bookRepository.save(book);
        return bookMapper.toBookResponse(book);
    }

    public List<BookResponse> getAll() {
        return this.bookRepository.findAll().stream()
                .map(this.bookMapper::toBookResponse).collect(Collectors.toList());
    }

    public Page<Book> getPageable(Integer page, Integer size, String sortBy, String direction) {
        Sort sort = Sort.by(sortBy);

        if (direction.equals(Sort.Direction.ASC.name()))
            sort.ascending();
        else
            sort.descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return this.bookRepository.findAll(pageable);
    }

    public Optional<Book> getById(Long id) {
        return this.bookRepository.findById(id);
    }

    public void update(Book book) {
        this.bookRepository.save(book);
    }
}
