package com.bookamore.backend.repository;

import com.bookamore.backend.entity.BookGenre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookGenreRepository extends JpaRepository<BookGenre, Long> {
     Optional<BookGenre> findByName(String name);
}
