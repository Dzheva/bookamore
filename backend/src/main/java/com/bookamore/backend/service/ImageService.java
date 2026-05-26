package com.bookamore.backend.service;

import com.bookamore.backend.dto.image.ImageRequest;
import com.bookamore.backend.dto.image.ImageResponse;
import com.bookamore.backend.entity.enums.EntityType;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface ImageService {

    ImageResponse save(ImageRequest imageRequest);

    List<ImageResponse> getImageByEntity(EntityType entityType, UUID uuid);

    void deleteImage(UUID imageId);
}
