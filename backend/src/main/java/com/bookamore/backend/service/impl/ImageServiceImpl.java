package com.bookamore.backend.service.impl;

import com.bookamore.backend.repository.ImageRepository;
import com.bookamore.backend.service.ImageService;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.ServletContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final ImageRepository imageRepository;

    private final ServletContext servletContext;

    @Value("${file.hash-algorithm}")
    private String hash_algorithm;

    private MessageDigest digest;

    private final static String IMAGE_PATH_TEMPLATE = "/img/%s/%s"; // '/img/{SUB_DIRECTORY}/{FILE_NAME}'

    @PostConstruct
    public void init() {
        try {
            this.digest = MessageDigest.getInstance(hash_algorithm);
        } catch (NoSuchAlgorithmException e) {
            log.error("Critical error: Hash algorithm does not exist. Called algorithm: '{}'. Shutting down.",
                    hash_algorithm, e);
            System.exit(1);  // The application must stop immediately if the hash algorithm does not exist.
        }
    }

    @Transactional
    public String saveImage(MultipartFile file, String subDir) {

        // get file name
        String originalFileName = Objects.requireNonNull(file.getOriginalFilename());
        originalFileName = StringUtils.cleanPath(originalFileName);

        // generate hash name
        String hashFileName = generateHashFileName(originalFileName, subDir);

        String savedFileName = imageRepository.saveImage(file, hashFileName, subDir);

        return String.format(IMAGE_PATH_TEMPLATE, subDir, savedFileName);
    }

    private String generateHashFileName(String originalFileName, String subDir) {
        // generate unique hash name
        String hashFileName = "";
        boolean isUnique = false;

        int count = 0;
        while (!isUnique) {
            hashFileName = getHashFileName(originalFileName);
            count++;
            if (!imageRepository.isExists(hashFileName, subDir)) {
                isUnique = true;
            } else if (count > 100) {
                throw new RuntimeException(
                        String.format(
                                "Unexpected error: more then 100 collisions occurred " +
                                        "while generating hash file name for '%s'", originalFileName)
                );
            }
        }

        return hashFileName;
    }

    private String getHashFileName(String fileName) {
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

    public Resource getImage(String fileName, String subDir) {
        return imageRepository.readImage(fileName, subDir);
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

    public void deleteImage(String fileName, String subDir) throws IOException {
        imageRepository.deleteImage(fileName, subDir);
    }
}
