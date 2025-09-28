package com.bookamore.backend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "file")
public class FileConfig {

    private String uploadDir;

    private Map<String, String> subDirs;

    private String subDirsPerms;
}
