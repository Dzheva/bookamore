package com.bookamore.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@Entity
@Table(name = "books_images")
@EqualsAndHashCode(callSuper = false)
public class BookImage extends BaseEntity {
    @Column(unique = true, nullable = false)
    private String path;
    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Book book;

    @ToString.Include(name = "bookId")
    private String bookIdToString() {
        return book == null ? "null" : String.valueOf(book.getId());
    }
}
