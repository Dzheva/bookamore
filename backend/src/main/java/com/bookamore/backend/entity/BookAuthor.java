package com.bookamore.backend.entity;

import com.bookamore.backend.entity.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "authors")
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
public class BookAuthor extends BaseEntity {
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
