package com.bookamore.backend.service;

import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ImageService {
    /*
     * @return saved file name
     */
    String saveImage(MultipartFile file, String subDir);

    Resource getImage(String fileName, String subDir);

    MediaType getMediaTypeByResource(Resource resource);

    void deleteImage(String fileName, String subDir) throws IOException;
}
