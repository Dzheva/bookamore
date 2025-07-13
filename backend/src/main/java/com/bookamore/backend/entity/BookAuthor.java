package com.bookamore.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "authors")
@Data
public class BookAuthor extends BaseEntity{
    @Column
    private String name;
    @ManyToMany(mappedBy = "authors")
    private List<Book> books = new ArrayList<>();
}
