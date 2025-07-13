package com.bookamore.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/hello")
public class Hello {
    @GetMapping("")
    public String sayHello() {
        return "Hello, World!";
    }
}
