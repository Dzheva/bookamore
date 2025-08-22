package com.bookamore.backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/hello")
@Tag(name = "Hello", description = "Endpoints for greeting and smoke testing.")
public class HelloController {
    @GetMapping("")
    public String sayHello() {
        return "HelloController, World!";
    }
}
