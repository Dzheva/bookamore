package com.bookamore.backend.repository.impl;


import com.bookamore.backend.repository.ImageStorageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;

@Slf4j
@RequiredArgsConstructor
public class ImageLocalStorageRepositoryImpl implements ImageStorageRepository {

    private final Path uploadDir;

    public void saveImage(MultipartFile file, String fileName, String subDir) throws IOException{

        Path targetLocation = uploadDir.resolve(subDir).resolve(fileName);

        try {
            Files.copy(file.getInputStream(), targetLocation);
            log.info("File saved successfully: {}", targetLocation.toAbsolutePath());
        } catch (FileAlreadyExistsException e) {
            log.error("Failed to save file: already exists at path '{}'", targetLocation.toAbsolutePath());
            throw e;
        } catch (IOException e) {
            log.error("Failed to save file: '{}' due to I/O error.", targetLocation.toAbsolutePath(), e);
            throw e;
        }
    }

    public boolean isExists(String fileName, String subDir) {
        Path location = uploadDir.resolve(subDir).normalize().resolve(fileName).normalize();
        return Files.exists(location);
    }

    public boolean deleteImage(String fileName, String subDir) throws IOException {
        Path targetLocation = uploadDir.resolve(subDir).normalize().resolve(fileName).normalize();

        try {
            // deleteIfExists() returns false instead of throwing NoSuchFileException
            // when the file is already gone, so a missing file is not treated as an error.
            boolean deleted = Files.deleteIfExists(targetLocation);
            if (deleted) {
                log.info("File '{}' deleted successfully.", targetLocation.toAbsolutePath());
            } else {
                log.warn("File '{}' does not exist; nothing to delete.", targetLocation.toAbsolutePath());
            }
            return deleted;
        } catch (IOException e) {
            log.error("Failed to delete file: '{}' due to I/O error.", targetLocation.toAbsolutePath(), e);
            throw e;
        }
    }
}
