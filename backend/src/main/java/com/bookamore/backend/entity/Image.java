package com.bookamore.backend.entity;

import com.bookamore.backend.entity.base.BaseEntity;
import com.bookamore.backend.entity.enums.EntityType;
import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "images")
public class Image extends BaseEntity {
    @Column(unique = true, nullable = false)
    private String path;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EntityType entityType;

    @Column
    private UUID entityId;

    @Column(length = 500)
    private String description;
}
