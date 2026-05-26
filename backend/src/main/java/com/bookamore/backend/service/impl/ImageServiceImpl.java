package com.bookamore.backend.service.impl;

import com.bookamore.backend.dto.image.ImageRequest;
import com.bookamore.backend.dto.image.ImageResponse;
import com.bookamore.backend.entity.Image;
import com.bookamore.backend.entity.enums.EntityType;
import com.bookamore.backend.exception.ResourceNotFoundException;
import com.bookamore.backend.mapper.image.ImageMapper;
import com.bookamore.backend.repository.BookRepository;
import com.bookamore.backend.repository.ImageRepository;
import com.bookamore.backend.repository.ImageStorageRepository;
import com.bookamore.backend.repository.OfferRepository;
import com.bookamore.backend.service.BookService;
import com.bookamore.backend.service.ImageService;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.ServletContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {
    private final ImageRepository imageRepository;
    private final ImageStorageRepository imageLocalStorageRepository;
    private final ImageMapper imageMapper;
    private final BookRepository bookRepository;
    private final OfferRepository offerRepository;
    private final ServletContext servletContext;
    private final BookService bookService;

    @Value("${file.hash-algorithm}")
    private String hash_algorithm;
    private MessageDigest digest;

    private final static String IMAGE_PATH_TEMPLATE = "/img/%s/%s";// '/img/{SUB_DIRECTORY}/{FILE_NAME}'
    private final static String IMAGE_SUBDIR_REGEXP = "^/img/(.+)/.+$";
    private final static String IMAGE_FILENAME_REGEXP = "^/img/.+/(.+)$";

    /**
     * Maximum number of images allowed per entity type.
     * -
     * By default, all entity types are limited to **1 image**.
     * To allow more images for a specific entity type, override
     * the default by adding an entry in this Map.
     */
    private final static Map<EntityType, Integer> IMAGE_LIMIT_BY_ENTITY = Map.of(
            EntityType.BOOK, 5
    );

    private static final long MIN_FILE_SIZE_BYTES = 5 * 1024;        // 5 KB
    private static final long MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "jpg", "jpeg", "png", "webp"
    );

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
    public Image saveImage(ImageRequest imageRequest) {

        EntityType entityType = imageRequest.getEntityType();
        UUID entityId = imageRequest.getEntityId();
        MultipartFile imageFile = imageRequest.getFile();

        validateEntity(entityType, entityId);
        validateImageFileToSave(entityType, imageFile);

        String path = saveImageToLocalStorage(imageFile, entityType);

        return imageRepository.save(imageMapper.toEntity(imageRequest, path));
    }

    @Transactional
    public ImageResponse save(ImageRequest imageRequest) {
        Image image = saveImage(imageRequest);

        // spike for bookImage
        if (imageRequest.getEntityType().equals(EntityType.BOOK)) {
            bookService.addImage(imageRequest.getEntityId(), image.getPath());
        }

        return imageMapper.toResponse(
                image
        );
    }

    @Transactional
    public List<ImageResponse> getImageByEntity(EntityType entityType, UUID uuid) {
        return imageRepository.findAllByEntityTypeAndEntityId(entityType, uuid)
                .stream()
                .map(imageMapper::toResponse)
                .toList();
    }

    private void validateImageFileToSave(EntityType entityType, MultipartFile imageFile) {

        // Check if the image is non-empty
        if (imageFile == null || imageFile.isEmpty()) {
            log.warn("Empty image upload attempt for entityType={}", entityType);
            throw new IllegalArgumentException("Image file is required. Please upload a valid image.");
        }

        // Check image content type
        String contentType = imageFile.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            log.warn(
                    "Image upload rejected: unsupported content type. " +
                            "entityType={}, originalFileName='{}', contentType='{}', allowed={}",
                    entityType,
                    imageFile.getOriginalFilename(),
                    contentType,
                    ALLOWED_CONTENT_TYPES
            );
            throw new IllegalArgumentException(
                    String.format(
                            "Unsupported image format. Allowed formats: %s.",
                            String.join(" ,", ALLOWED_CONTENT_TYPES)
                    )
            );
        }

        // Check image extension
        String fileName = imageFile.getOriginalFilename();
        String extension = fileName == null ? "" :
                fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
        if (fileName == null || !ALLOWED_EXTENSIONS.contains(extension)) {
            log.warn(
                    "Image upload rejected: invalid file extension. " +
                            "entityType={}, originalFileName='{}', extension='{}', allowed={}",
                    entityType,
                    fileName,
                    extension,
                    ALLOWED_EXTENSIONS
            );

            throw new IllegalArgumentException(
                    String.format(
                            "Invalid file extension. Allowed extensions: %s.",
                            String.join(" ,", ALLOWED_EXTENSIONS)
                    )
            );
        }

        // Check image size
        long fileSize = imageFile.getSize();

        if (fileSize < MIN_FILE_SIZE_BYTES) {
            log.warn(
                    "Image upload rejected: file too small. " +
                            "entityType={}, originalFileName='{}', size={} bytes, minAllowed={} bytes",
                    entityType,
                    fileName,
                    fileSize,
                    MIN_FILE_SIZE_BYTES
            );
            throw new IllegalArgumentException(
                    String.format("Image is too small. Minimum allowed size is %d KB.",
                            MIN_FILE_SIZE_BYTES / 1024)
            );
        }

        if (fileSize > MAX_FILE_SIZE_BYTES) {
            log.warn(
                    "Image upload rejected: file too large. " +
                            "entityType={}, originalFileName='{}', size={} bytes, maxAllowed={} bytes",
                    entityType,
                    fileName,
                    fileSize,
                    MAX_FILE_SIZE_BYTES
            );
            throw new IllegalArgumentException(
                    String.format("Image is too large. Maximum allowed size is %d MB.",
                            MAX_FILE_SIZE_BYTES / (1024 * 1024))
            );
        }

    }

    private void validateEntity(EntityType entityType, UUID entityId) {

        // Check if the entity exists
        boolean exists;
        switch (entityType) {
            case BOOK -> exists = bookRepository.existsById(entityId);
            case OFFER -> exists = offerRepository.existsById(entityId);
            default -> throw new IllegalArgumentException("Unsupported entity type: " + entityType);
        }

        if (!exists) {
            log.warn("Image upload attempt for a non-existent entity! entityType={}, entityId={}",
                    entityType,
                    entityId
            );
            throw new IllegalArgumentException(
                    String.format("%s with ID %s does not exist", entityType, entityId)
            );
        }

        // Check whether the entity has reached the maximum allowed number of images
        long countOfImages = imageRepository.countByEntityId(entityId);
        long limitCountOfImagesByType = IMAGE_LIMIT_BY_ENTITY.getOrDefault(entityType, 1).longValue();

        if (countOfImages >= limitCountOfImagesByType) {
            log.warn("Image upload attempt for entity that has reached the maximum allowed number of images! " +
                            "Limit: {}, Current count: {}",
                    countOfImages,
                    limitCountOfImagesByType
            );
            throw new IllegalStateException(
                    String.format(
                            "%s with id %s has reached the maximum limit of %d images. " +
                                    "Current count: %d. Please delete an image before uploading a new one.",
                            entityType,
                            entityId,
                            limitCountOfImagesByType,
                            countOfImages
                    )
            );
        }
    }

    private String saveImageToLocalStorage(MultipartFile file, EntityType entityType) {
        // get subdirectory name
        String subDir = entityType.toString().toLowerCase();

        // get file name
        String originalFileName = Objects.requireNonNull(file.getOriginalFilename());
        originalFileName = StringUtils.cleanPath(originalFileName);

        // generate hash name
        String hashFileName = generateHashFileName(originalFileName, subDir);

        try {
            imageLocalStorageRepository.saveImage(file, hashFileName, subDir);
        } catch (IOException e) {
            log.error("Failed to save image: {}", e.toString());
            throw new RuntimeException("Failed to save image!");
        }
        // return path of saved file
        return String.format(IMAGE_PATH_TEMPLATE, subDir, hashFileName);
    }

    private String generateHashFileName(String originalFileName, String subDir) {
        // generate unique hash name
        String hashFileName = "";
        boolean isUnique = false;

        int count = 0;
        while (!isUnique) {
            hashFileName = getHashFileName(originalFileName);
            count++;
            if (!imageLocalStorageRepository.isExists(hashFileName, subDir)) {
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
        String extension;
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = fileName.substring(dotIndex);
            fileName = fileName.substring(0, dotIndex);
        } else {
            throw new RuntimeException(String.format("Failed to read file extension. File '%s'", fileName));
        }

        String input = fileName + System.currentTimeMillis();
        byte[] hash = this.digest.digest(input.getBytes());
        String hexHash = HexFormat.of().formatHex(hash);

        return hexHash + extension;
    }

    @Transactional
    public void deleteImage(UUID imageId) {

        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found with id: " + imageId));

        String path = image.getPath();

        String subdir = Pattern.compile(IMAGE_SUBDIR_REGEXP)
                .matcher(path)
                .results()
                .map(m -> m.group(1))
                .findFirst()
                .orElseThrow(
                        () -> {
                            log.warn("Failed to extract subdirectory from string='{}', imageId='{}'", path, imageId);
                            return new RuntimeException("Failed to extract subdirectory from path!");
                        }
                );

        String fileName = Pattern.compile(IMAGE_FILENAME_REGEXP)
                .matcher(path)
                .results()
                .map(m -> m.group(1))
                .findFirst()
                .orElseThrow(
                        () -> {
                            log.warn("Failed to extract file name from string='{}', imageId='{}'", path, imageId);
                            return new RuntimeException("Failed to extract file name from path!");
                        }
                );

        try {
            imageLocalStorageRepository.deleteImage(fileName, subdir);
        } catch (IOException e) {
            log.error("Failed to delete image: {}", e.toString());
            throw new RuntimeException("Failed to delete image!");
        }
        imageRepository.delete(image);
    }
}
