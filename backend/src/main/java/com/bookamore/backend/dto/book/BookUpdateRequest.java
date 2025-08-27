package com.bookamore.backend.dto.book;

import com.bookamore.backend.entity.enums.BookCondition;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class BookUpdateRequest {

    @Size(min = 1, max = 255, message = "The title must be between 1 and 255 characters.")
    @Schema(example = "Clean Code", description = "Book title")
    private String title;

    @Min(value = 1450, message = "Year of release must be no earlier than 1450.")
    @Max(value = 2100, message = "Year of release must be no later than 2100.")
    @Schema(example = "2008", description = "Year the book was released")
    private Integer yearOfRelease;

    @Size(max = 500, message = "Description can be up to 500 characters.")
    @Schema(example = "A Handbook of Agile Software Craftsmanship.", description = "Book description")
    private String description;

    //TODO Validation
    @Schema(example = "9783161484100", description = "ISBN number of the book")
    private String isbn;

    @Schema(example = "NEW", description = "Condition of the book")
    private BookCondition condition;

    @Schema(example = "[\"Robert C. Martin\"]", description = "List of authors")
    private List<String> authors;

    @Schema(example = "[\"Classic\", \"Novel\"]", description = "List of genres")
    private List<String> genres;

    @Schema(example = "[\"image1.jpg\", \"image2.jpg\"]", description = "List of image file names")
    private List<String> images;
}
