package com.bookamore.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Entity
@Table(name = "authors")
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
public class BookAuthor extends BaseEntity{
    @Column(unique = true, nullable = false)
    private String name;

    @ManyToMany(mappedBy = "authors", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Book> books = new ArrayList<>();
/*
    @ToString.Include(name = "bookIds")
    private String bookIdsToString() {
        return books == null
                ? "null"
                : books.stream().map(b -> String.valueOf(b.getId())).collect(Collectors.joining(", "));
    }*/
}
