package com.bookamore.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "books_images")
@Data
public class BookImage extends BaseEntity{
    @Column
    private String path;
    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;
}
