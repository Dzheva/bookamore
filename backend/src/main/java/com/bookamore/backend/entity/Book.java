package com.bookamore.backend.entity;

import com.bookamore.backend.entity.enums.BookCondition;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Entity
@Table(name = "books")
@EqualsAndHashCode(callSuper = false)
public class Book extends BaseEntity {
    @Column(nullable = false)
    private String title;
    @Column(length = 500)
    private String description;
    @Column
    private String isbn;

    @Enumerated(EnumType.STRING)
    private BookCondition bookCondition;

    @ManyToMany(cascade = CascadeType.PERSIST)
    @JoinTable(
            name = "authors_books",
            joinColumns = @JoinColumn(nullable = false, name = "book_id"),
            inverseJoinColumns = @JoinColumn(nullable = false, name = "author_id")
    )
    private List<BookAuthor> authors = new ArrayList<>();

    @ManyToMany(cascade = CascadeType.PERSIST)
    @JoinTable(
            name = "genres_books",
            joinColumns = @JoinColumn(nullable = false, name = "book_id"),
            inverseJoinColumns = @JoinColumn(nullable = false, name = "genre_id")
    )
    private List<BookGenre> genres = new ArrayList<>();

    @OneToMany(mappedBy = "book", cascade = CascadeType.PERSIST)
    private List<BookImage> images = new ArrayList<>();


    public String getAuthorsNames() {
        if (this.authors.isEmpty()) {
            return "";
        } else if (this.authors.size() == 1)
            return this.authors.get(0).getName();
        else {
            return this.authors.stream().map(BookAuthor::getName).collect(Collectors.joining(", "));
        }
    }
}
