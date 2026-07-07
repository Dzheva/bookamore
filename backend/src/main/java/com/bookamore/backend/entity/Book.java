package com.bookamore.backend.entity;

import com.bookamore.backend.entity.base.BaseEntity;
import com.bookamore.backend.entity.enums.BookCondition;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.BatchSize;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "books")
@EqualsAndHashCode(callSuper = false)
public class Book extends BaseEntity {

    @OneToOne(mappedBy = "book")
    @ToString.Exclude
    private Offer offer;

    @Column(nullable = false)
    private String title;
    @Column(name = "year_of_release", nullable = false)
    private Integer yearOfRelease;
    @Column(length = 500)
    private String description;
    @Column
    private String isbn;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookCondition condition;

    @ManyToMany
    @JoinTable(
            name = "books_authors",
            joinColumns = @JoinColumn(nullable = false, name = "book_id"),
            inverseJoinColumns = @JoinColumn(nullable = false, name = "author_id")
    )
    @BatchSize(size = 10)
    private List<BookAuthor> authors = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "books_genres",
            joinColumns = @JoinColumn(nullable = false, name = "book_id"),
            inverseJoinColumns = @JoinColumn(nullable = false, name = "genre_id")
    )
    @BatchSize(size = 10)
    private List<BookGenre> genres = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "entity_id", referencedColumnName = "id", insertable = false, updatable = false)
    @org.hibernate.annotations.Where(clause = "entity_type = 'BOOK'")
    @BatchSize(size = 10)
    private List<Image> images = new ArrayList<>();

    @ToString.Include(name = "offerId")
    private String bookIdToString() {
        return offer == null ? "null" : String.valueOf(offer.getId());
    }

}
