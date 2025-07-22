package com.bookamore.backend.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookResponse {
    private Long id;
    private String title;
    private List<String> authors;
    private BigDecimal price;
    private String condition;
    private List<String> genres;
    private String type;
    private String isbn;
    private List<String> images;
    private String description;
}
