package com.bookamore.backend.repository.impl;


import com.bookamore.backend.exception.ResourceNotFoundException;
import com.bookamore.backend.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;

@Slf4j
@RequiredArgsConstructor
public class ImageLocalStorageRepositoryImpl implements ImageRepository {

    private final Path uploadDir;

    public String saveImage(MultipartFile file, String fileName, String subDir) {

        Path targetLocation = uploadDir.resolve(subDir).resolve(fileName);

        // write file to disk
        try {
            Files.copy(file.getInputStream(), targetLocation);
        } catch (FileAlreadyExistsException e) {
            // TODO FileStorageException
            throw new RuntimeException(e.getMessage());
        } catch (IOException e) {
            // TODO FileStorageException
            throw new RuntimeException(String.format(
                    "Failed to write file. Original file name: '%s'. Writing file name: '%s'",
                    file.getOriginalFilename(), fileName));
        }

        // return file name to store in DB
        return fileName;
    }

    public boolean isExists(String fileName, String subDir) {
        Path location = uploadDir.resolve(uploadDir).normalize();
        location = location.resolve(fileName).normalize();
        return isExists(location);
    }

    private boolean isExists(Path location) {
        return Files.exists(location);
    }

    public Resource readImage(String fileName, String subDir) {
        Path filePath = uploadDir.resolve(subDir).normalize().resolve(fileName).normalize();

        if (!filePath.toString().contains(uploadDir.toString())) {
            throw new SecurityException("Invalid file path");
        }

        Resource resource;

        try {
            resource = new UrlResource(filePath.toUri());
        } catch (MalformedURLException ex) {
            log.error("Incorrect URI: {}", filePath.toUri());
            // TODO FileStorageException
            throw new RuntimeException(String.format("Failed to load file: {%s}", fileName));
        }

        if (!resource.exists()) {
            throw new ResourceNotFoundException(String.format("File not found by name: '%s'", fileName));
        }

        return resource;
    }

    public void deleteImage(String fileName, String subDir) {
        Path targetLocation = uploadDir.resolve(subDir).normalize().resolve(fileName).normalize();

        if (!Files.exists(targetLocation)) {
            // TODO FileStorageException
            throw new RuntimeException(String.format("File %s does not exists", fileName));
        }

        try {
            Files.delete(targetLocation);
        } catch (IOException e) {
            // TODO FileStorageException
            throw new RuntimeException(e);
        }
    }
}
