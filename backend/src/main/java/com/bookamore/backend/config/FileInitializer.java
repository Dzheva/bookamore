package com.bookamore.backend.config;

import com.bookamore.backend.repository.ImageRepository;
import com.bookamore.backend.repository.impl.ImageLocalStorageRepositoryImpl;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.io.FileNotFoundException;
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
        resolveRootUploadDir();
        createSubDirsIfNotExists();
    }

    @Bean
    public ImageRepository imageRepository() {
        return new ImageLocalStorageRepositoryImpl(this.uploadDir);
    }

    private void resolveRootUploadDir() {

        String configUploadDir = fileConfig.getUploadDir();

        if (configUploadDir == null) {
            log.error("Failed to fetch upload directory! Configuration: {}", this.fileConfig);
            System.exit(1);
        }

        log.info("Trying to resolve upload directory '{}'", configUploadDir);

        this.uploadDir = Paths.get(configUploadDir).toAbsolutePath().normalize();

        File uploadDirectory = new File(uploadDir.toAbsolutePath().toString());

        if (!uploadDirectory.exists() || !uploadDirectory.isDirectory()) {

            log.error("Critical error: Upload directory does not exist." +
                            " Called path: '{}'. Config path: '{}'. Shutting down.",
                    uploadDirectory.getAbsolutePath(), configUploadDir,
                    new FileNotFoundException("Directory not found"));

            System.exit(1);  // The application must stop immediately if the upload directory does not exist.
        } else {
            log.info("Upload directory is '{}'", uploadDir.toString());
        }
    }

    private void createSubDirsIfNotExists() {

        if (this.uploadDir == null) {
            log.error("Root upload directory was not resolved");
            System.exit(1);
        }

        /*
         * POSIX permissions examples
         * (755 = rwxr-xr-x)
         * (750 = rwxr-x---)
         * (775 = rwxrwxr-x)
         */
        String subDirsRwxPerms = octalToRwx(fileConfig.getSubDirsPerms());
        Set<PosixFilePermission> perms = PosixFilePermissions.fromString(subDirsRwxPerms);
        FileAttribute<Set<PosixFilePermission>> fileAttributes = PosixFilePermissions.asFileAttribute(perms);

        Map<String, String> subDirs = fileConfig.getSubDirs();

        for (String subDirKey : subDirs.keySet()) {

            String subDirName = subDirs.get(subDirKey);
            Path subDirLocation = uploadDir.resolve(subDirName);

            try {
                if (!Files.exists(subDirLocation)) {
                    log.info("Creating subdirectory '{}'", subDirName);
                }
                Files.createDirectories(subDirLocation, fileAttributes);
            } catch (IOException ex) {
                log.error("An error occurred while creating subdirectory '{}': {}", subDirLocation, ex.getMessage());
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
