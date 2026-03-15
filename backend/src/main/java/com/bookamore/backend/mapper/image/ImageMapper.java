package com.bookamore.backend.mapper.image;

import com.bookamore.backend.dto.image.ImageRequest;
import com.bookamore.backend.dto.image.ImageResponse;
import com.bookamore.backend.entity.Image;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING
)
public interface ImageMapper {

    ImageResponse toResponse(Image image);

    @Mapping(target = "path", source = "pathOfSavedFile")
    Image toEntity(ImageRequest imageRequest, String pathOfSavedFile);
}
