package com.bookamore.backend.dto.book;

import com.bookamore.backend.entity.enums.BookCondition;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookResponse {
    private UUID id;
    private String title;
    private Integer yearOfRelease;
    private String description;
    private String isbn;
    private BookCondition condition;
    private List<String> authors;
    private List<String> genres;
    private List<String> images;
}
