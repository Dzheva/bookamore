package com.bookamore.backend.controller;

import com.bookamore.backend.service.ImageService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Slf4j
//@RestController
//@RequestMapping("api/v1/images")
@RequiredArgsConstructor
public class ImageController {
    private final ImageService imageService;

    /*
     * Example controller method to upload image.
     * Uncomment to use
     */
    /*@Operation(summary = "testing upload ONE image")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED).body(imageService.saveImage(file, ""));
    }*/

    /*
     * Example controller method to upload list of images.
     * Uncomment to use
     */
    /*@Operation(summary = "testing upload MANY image")
    @PostMapping(value = "upload-many", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<String>> uploadImages(@RequestParam("files") List<MultipartFile> files) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                files.stream()
                        .map(f -> imageService.saveImage(f, ""))
                        .toList()
        );
    }*/

    /*@GetMapping("/{fileName}")
    public ResponseEntity<Resource> getImage(@PathVariable String fileName) {
        Resource resource = imageService.getImage(fileName, "");
        return ResponseEntity.ok()
                .contentType(imageService.getMediaTypeByResource(resource))
                .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic())
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        String.format("inline; filename=\"%s\"", fileName))
                .body(resource);
    }*/

    /*
     * Example controller method to delete image by name.
     * Uncomment to use
     */
    /*@DeleteMapping("/{fileName}")
    public ResponseEntity<Void> deleteImage(@PathVariable String fileName) {
        imageService.deleteImage(fileName, "");
        return ResponseEntity.noContent().build();
    }*/
}
