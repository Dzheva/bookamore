package com.bookamore.backend.service;

import com.bookamore.backend.entity.Book;
import com.bookamore.backend.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    // TODO add DTO Filters and Response obj
    public void create(Book book) {
        this.bookRepository.save(book);
    }

    public List<Book> getAll() {
        return this.bookRepository.findAll();
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
