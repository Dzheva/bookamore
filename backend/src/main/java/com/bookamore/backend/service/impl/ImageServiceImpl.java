package com.bookamore.backend.service.impl;

import com.bookamore.backend.exception.ResourceNotFoundException;
import com.bookamore.backend.service.ImageService;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.ServletContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final ServletContext servletContext;

    @Value("${file.upload-dir}")
    private String configUploadDir;

    private Path uploadDir;

    @Value("${file.hash-algorithm}")
    private String hash_algorithm;

    private MessageDigest digest;

    @PostConstruct
    public void init() {

        this.uploadDir = Paths.get(configUploadDir).toAbsolutePath().normalize();

        File uploadDirectory = new File(uploadDir.toAbsolutePath().toString());

        if (!uploadDirectory.exists() || !uploadDirectory.isDirectory()) {

            log.error("Critical error: Upload directory does not exist." +
                            " Called path: '{}'. Config path: '{}'. Shutting down.",
                    uploadDirectory.getAbsolutePath(), configUploadDir,
                    new FileNotFoundException("Directory not found"));

            System.exit(1);  // The application must stop immediately if the upload directory does not exist.
        }

        try {
            this.digest = MessageDigest.getInstance(hash_algorithm);
        } catch (NoSuchAlgorithmException e) {
            log.error("Critical error: Hash algorithm does not exist. Called algorithm: '{}'. Shutting down.",
                    hash_algorithm, e);
            System.exit(1);  // The application must stop immediately if the hash algorithm does not exist.
        }

    }

    @Transactional
    public String saveImage(MultipartFile file) {
        // get file name
        String originalFileName = Objects.requireNonNull(file.getOriginalFilename());
        originalFileName = StringUtils.cleanPath(originalFileName);

        // generate unique hash name
        String hashFileName = "";
        Path targetLocation = null;
        boolean isUnique = false;
        int count = 0;
        while (!isUnique) {
            hashFileName = generateHashFileName(originalFileName);
            targetLocation = uploadDir.resolve(hashFileName);
            count++;
            if (!Files.exists(targetLocation)) {
                isUnique = true;
            } else if (count > 100) {
                throw new RuntimeException(
                        String.format(
                                "Unexpected error: more then 100 collisions occurred " +
                                        "while generating hash file name for '%s'", originalFileName)
                );
            }
        }

        // write file to disk
        try {
            Files.copy(file.getInputStream(), targetLocation);
        } catch (FileAlreadyExistsException e) {
            // TODO FileStorageException
            throw new RuntimeException(e.getMessage());
        } catch (IOException e) {
            // TODO FileStorageException
            throw new RuntimeException(String.format(
                    "Failed to write file. Original file name: '%s'. Hash file name: '%s'",
                    originalFileName, hashFileName));
        }

        // return file name to store in DB
        return hashFileName;
    }

    private String generateHashFileName(String fileName) {
        String extension = "";
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = fileName.substring(dotIndex);
            fileName = fileName.substring(0, dotIndex);
        } else {
            // TODO FileStorageException
            throw new RuntimeException(String.format("Failed to read file extension. File '%s'", fileName));
        }

        String input = fileName + System.currentTimeMillis();
        byte[] hash = this.digest.digest(input.getBytes());
        String hexHash = HexFormat.of().formatHex(hash);

        return hexHash + extension;
    }

    public Resource getImageByName(String fileName) {

        Path filePath = uploadDir.resolve(fileName).normalize();

        if (!filePath.startsWith(uploadDir)) {
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

    public MediaType getMediaTypeByResource(Resource resource) {
        try {
            String mimeType = servletContext.getMimeType(resource.getFile().getAbsolutePath());

            if (mimeType == null) {
                log.warn("Unknown file extension: {}", resource.getFile().getAbsolutePath());
                throw new RuntimeException("Unknown file extension");  // TODO FileStorageException
            }

            return MediaType.valueOf(mimeType);

        } catch (IOException ex) {
            log.warn("Error resolving media type by resource! {}", resource);
            throw new RuntimeException("Error resolving media type by resource!");  // TODO FileStorageException
        }
    }

    public void deleteImage(String fileName) {
        Path targetLocation = uploadDir.resolve(fileName);

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
