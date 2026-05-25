package com.bookamore.backend.repository;

import com.bookamore.backend.entity.Offer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface OfferRepository extends JpaRepository<Offer, UUID>, JpaSpecificationExecutor<Offer> {
    @EntityGraph(attributePaths = {"book", "user"})
    @Override
    Page<Offer> findAll(Specification<Offer> spec, Pageable pageable);
}
