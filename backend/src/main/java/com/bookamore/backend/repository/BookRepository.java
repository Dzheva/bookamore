package com.bookamore.backend.repository;

import com.bookamore.backend.entity.Book;
import com.bookamore.backend.entity.BookGenre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BookRepository extends JpaRepository<Book, UUID>, JpaSpecificationExecutor<Book> {
    List<Book> findAllByGenres(BookGenre genre);
}
