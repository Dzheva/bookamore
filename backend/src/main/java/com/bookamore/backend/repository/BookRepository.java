package com.bookamore.backend.repository;

import com.bookamore.backend.entity.Book;
import com.bookamore.backend.entity.BookGenre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    public List<Book> findAllByGenres(BookGenre genre);
}
