package com.bookamore.backend.repository;

import com.bookamore.backend.entity.Image;
import com.bookamore.backend.entity.enums.EntityType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ImageRepository extends JpaRepository<Image, UUID> {
    long countByEntityId(UUID entityId);

    List<Image> findAllByEntityTypeAndEntityId(EntityType entityType, UUID entityId);
}
