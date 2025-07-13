package com.bookamore.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "books_images")
@EqualsAndHashCode(callSuper = false)
public class BookImage extends BaseEntity{
    @Column(nullable = false)
    private String path;
    @ManyToOne
    @JoinColumn(nullable = false, name = "book_id")
    private Book book;
}
