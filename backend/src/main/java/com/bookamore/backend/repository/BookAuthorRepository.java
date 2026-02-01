package com.bookamore.backend.repository;

import com.bookamore.backend.entity.BookAuthor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookAuthorRepository extends JpaRepository<BookAuthor, UUID> {
     Optional<BookAuthor> findByName(String name);
}
