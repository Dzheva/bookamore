package com.bookamore.backend.dto.image;

import com.bookamore.backend.entity.enums.EntityType;
import lombok.Data;

import java.util.UUID;

@Data
public class ImageResponse {
    private UUID id;
    private EntityType entityType;
    private UUID entityId;
    private String path;
    private String description;
}
