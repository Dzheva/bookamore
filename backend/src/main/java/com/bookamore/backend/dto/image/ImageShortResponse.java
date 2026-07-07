package com.bookamore.backend.dto.image;

import lombok.Data;

import java.util.UUID;

@Data
public class ImageShortResponse {
    private UUID id;
    private String path;
}
