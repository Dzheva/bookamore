package com.bookamore.backend.dto.request;

import com.bookamore.backend.entity.enums.BookCondition;
import lombok.Data;

import java.util.List;

@Data
public class BookRequest {
    private String title;
    private Integer yearOfRelease;
    private String description;
    private String isbn;
    private BookCondition condition;
    private List<String> authors;
    private List<String> genres;
    private List<String> images;
}
