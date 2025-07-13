package com.bookamore.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "genres")
@EqualsAndHashCode(callSuper = false)
public class BookGenre extends BaseEntity{
    @Column(unique = true, nullable = false)
    private String name;
}
