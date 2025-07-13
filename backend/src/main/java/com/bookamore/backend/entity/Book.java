package com.bookamore.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "books")
@Data
public class Book extends BaseEntity {
    @Column
    private String title;
    @Column(length = 500)
    private String description;
    @Column
    private String isbn;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "condition_id")
    private BookCondition condition;

    @ManyToMany(cascade = CascadeType.PERSIST)
    @JoinTable(
            name = "authors_books",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "author_id")
    )
    private List<BookAuthor> authors = new ArrayList<>();

    @ManyToMany(cascade = CascadeType.PERSIST)
    @JoinTable(
            name = "genres_books",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
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
