package com.bookamore.backend.dto.request;

import com.bookamore.backend.entity.enums.BookCondition;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class BookRequest {
    private String title;
    private List<String> authors;
    private BigDecimal price;
    private BookCondition condition;
    private List<String> genres;
    private String type;
    private String isbn;
    private List<String> images;
    private String description;
}
