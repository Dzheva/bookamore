package com.bookamore.backend.repository;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface ImageRepository {

    String saveImage(MultipartFile file, String fileName, String subDir);

    boolean isExists(String fileName, String subDir);

    Resource readImage(String fileName, String subDir);

    void deleteImage(String fileName, String subDir);
}
