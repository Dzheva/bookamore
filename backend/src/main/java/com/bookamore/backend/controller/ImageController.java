package com.bookamore.backend.controller;

import com.bookamore.backend.service.ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.concurrent.TimeUnit;

@Slf4j
@RestController
@RequestMapping("api/v1/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED).body(imageService.saveImage(file));
    }

    @GetMapping("/{fileName}")
    public ResponseEntity<Resource> getImage(@PathVariable String fileName) {
        Resource resource = imageService.getImageByName(fileName);
        return ResponseEntity.ok()
                .contentType(imageService.getMediaTypeByResource(resource))
                .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic())
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + fileName + "\"")
                .body(resource);
    }

    @DeleteMapping("/{fileName}")
    public ResponseEntity<Void> deleteImage(@PathVariable String fileName) {
        imageService.deleteImage(fileName);
        return ResponseEntity.noContent().build();
    }
}
