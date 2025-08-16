package com.bookamore.backend.config;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Set;

@Configuration
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        scheme = "bearer"
)
public class OpenApiConfig {
    // Set of public endpoint operation IDs to customize.
    // Use this set to easily add or remove public endpoints.
    private static final Set<String> PUBLIC_ENDPOINTS = Set.of("signIn", "signUp");

    @Bean
    public OpenApiCustomizer customizeOpenAPI() {
        return openApi -> openApi.getPaths().values().forEach(pathItem -> pathItem.readOperations().forEach(operation -> {
            // Check if the current operation is for the /api/public/signin path
            if (operation.getOperationId() != null && PUBLIC_ENDPOINTS.contains(operation.getOperationId())) {
                // Remove the unwanted responses
                if (operation.getResponses() != null) {
                    operation.getResponses().remove("404");
                    operation.getResponses().remove("409");
                }
            }
        }));
    }

    @Bean
    public OpenAPI customOpenAPI() {
        var securityRequirement = new SecurityRequirement().addList("bearerAuth");

        return new OpenAPI()
                .info(new Info().title("Book Amore API").version("1.0.0").description(
                        "API for the Book Amore application."))
                .addSecurityItem(securityRequirement);
    }
}
