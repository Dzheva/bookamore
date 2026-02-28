package com.bookamore.backend.repository;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ImageStorageRepository {

    void saveImage(MultipartFile file, String fileName, String subDir) throws IOException;

    boolean isExists(String fileName, String subDir);

    void deleteImage(String fileName, String subDir) throws IOException;
}
