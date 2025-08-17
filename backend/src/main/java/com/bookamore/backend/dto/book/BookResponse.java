package com.bookamore.backend.dto.book;

import com.bookamore.backend.entity.enums.BookCondition;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookResponse {
    private Long id;
    private String title;
    private Integer yearOfRelease;
    private String description;
    private String isbn;
    private BookCondition condition;
    private List<String> authors;
    private List<String> genres;
    private List<String> images;
}
