package com.bookamore.backend.repository;

import com.bookamore.backend.entity.BookCondition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookConditionRepository extends JpaRepository<BookCondition, Long> {
    public Optional<BookConditionRepository> findByName(String name);
}
