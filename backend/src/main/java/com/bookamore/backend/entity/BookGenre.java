package com.bookamore.backend.entity;

import com.bookamore.backend.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "genres")
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
public class BookGenre extends BaseEntity {
    @Column(unique = true, nullable = false)
    private String name;

    @ManyToMany(mappedBy = "genres", fetch = FetchType.LAZY)
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
