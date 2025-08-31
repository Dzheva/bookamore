package com.bookamore.backend.service;

import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

public interface ImageService {
    /*
    * @return saved file name
     */
    String saveImage(MultipartFile file);

    Resource getImageByName(String fileName);

    MediaType getMediaTypeByResource(Resource resource);
}
