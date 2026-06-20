package com.bookamore.backend.config;

import io.github.cdimascio.dotenv.Dotenv;

public class EnvConfig {
    public static void loadEnv(){
        // ./src/main/resources/ працює і локально (backend/) і в Docker (WORKDIR /app = backend/)
        Dotenv dotenv = Dotenv.configure()
                .directory("./src/main/resources/")
                .ignoreIfMissing()
                .load();
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
    }
}
