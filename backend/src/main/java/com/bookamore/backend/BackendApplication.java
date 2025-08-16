package com.bookamore.backend;

import com.bookamore.backend.config.EnvConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class BackendApplication {

    public static void main(String[] args) {
        EnvConfig.loadEnv();
        SpringApplication.run(BackendApplication.class, args);
    }

}
