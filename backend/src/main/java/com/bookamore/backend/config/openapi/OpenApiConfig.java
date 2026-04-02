package com.bookamore.backend.config.openapi;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.servers.Server;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        scheme = "bearer"
)
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI(HttpServletRequest request) {
        // 1. Resolve the server URL based on the incoming request origin
        // This ensures if you hit https://api.bookamore.com, Swagger uses that as the base.
        String contextPath = request.getContextPath();
        String serverUrl = request.getRequestURL().toString().replace(request.getRequestURI(), "") + contextPath;

        return new OpenAPI()
                .info(new Info()
                        .title("Bookamore API")
                        .version("1.0.0")
                        .description("API for the Bookamore application."))
                // 2. Explicitly set the server list so Swagger doesn't "guess" incorrectly
                .servers(List.of(new Server().url(serverUrl).description("Current Environment")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }
}
