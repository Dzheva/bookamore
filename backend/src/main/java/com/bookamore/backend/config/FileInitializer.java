package com.bookamore.backend.config;

import com.bookamore.backend.repository.ImageRepository;
import com.bookamore.backend.repository.impl.ImageLocalStorageRepositoryImpl;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.FileAttribute;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.Map;
import java.util.Set;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class FileInitializer {

    private final FileConfig fileConfig;

    private Path uploadDir;

    @PostConstruct
    private void prepareOutputDirectories() {
        initializeRootUploadDir();
        validateRootUploadDir(uploadDir);
        createSubDirsIfNotExists();
    }

    @Bean
    public ImageRepository imageRepository() {
        return new ImageLocalStorageRepositoryImpl(uploadDir);
    }

    private void initializeRootUploadDir() {

        // Read configuration and determine the absolute path
        String configUploadDir = fileConfig.getUploadDir();

        if (configUploadDir == null) {
            log.error("Failed to fetch upload directory! Configuration: {}", fileConfig);
            throw new IllegalStateException("Application startup failed: Upload directory configuration missing.");
        }

        log.info("Trying to resolve upload directory '{}'", configUploadDir);

        uploadDir = Paths.get(configUploadDir).toAbsolutePath().normalize();
    }

    private void validateRootUploadDir(Path path) {

        if (!Files.exists(path) || !Files.isDirectory(path)) {
            log.error("Critical error: Upload directory does not exist or is not a directory. Path: '{}'.",
                    path.toAbsolutePath());

            throw new IllegalStateException("Application startup failed: Root upload directory is invalid or missing at "
                    + path.toAbsolutePath());
        }
        log.info("Upload directory is successfully validated: '{}'", path.toString());
    }

    private void createSubDirsIfNotExists() {

        if (uploadDir == null) {
            log.error("Root upload directory was not resolved");
            throw new IllegalStateException("Root upload directory was not resolved");
        }

        // Check if the system supports POSIX
        boolean supportsPosix = uploadDir.getFileSystem()
                .supportedFileAttributeViews()
                .contains("posix");

        // Prepare attributes if they are supported
        FileAttribute<?>[] attributes = null;
        if (supportsPosix) {
            String subDirsRwxPerms = octalToRwx(fileConfig.getSubDirsPerms());
            Set<PosixFilePermission> perms = PosixFilePermissions.fromString(subDirsRwxPerms);
            FileAttribute<Set<PosixFilePermission>> fileAttributes = PosixFilePermissions.asFileAttribute(perms);
            attributes = new FileAttribute<?>[]{fileAttributes};
        }

        Map<String, String> subDirs = fileConfig.getSubDirs();

        for (String subDirKey : subDirs.keySet()) {
            String subDirName = subDirs.get(subDirKey);
            Path subDirLocation = uploadDir.resolve(subDirName);

            try {
                if (!Files.exists(subDirLocation)) {
                    log.info("Creating subdirectory '{}'", subDirName);
                }

                if (attributes != null) {
                    Files.createDirectories(subDirLocation, attributes);
                } else {
                    Files.createDirectories(subDirLocation);
                }

            } catch (IOException ex) {
                log.error("An error occurred while creating subdirectory '{}': {}", subDirLocation, ex.getMessage());
                throw new IllegalStateException(
                        String.format("Application startup failed: Upload subdirectory is invalid or missing at '%s'",
                                subDirLocation
                        )
                );
            }
        }
    }

    private String octalToRwx(String octal) {
        StringBuilder sb = new StringBuilder();
        for (char c : octal.toCharArray()) {
            int val = Character.digit(c, 8);
            sb.append((val & 4) != 0 ? "r" : "-");
            sb.append((val & 2) != 0 ? "w" : "-");
            sb.append((val & 1) != 0 ? "x" : "-");
        }
        return sb.toString();
    }
}
