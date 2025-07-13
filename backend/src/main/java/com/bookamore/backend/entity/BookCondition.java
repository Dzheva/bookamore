package com.bookamore.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "books_conditions")
@EqualsAndHashCode(callSuper = false)
public class BookCondition extends BaseEntity {
    @Column(unique = true, nullable = false)
    private String name;
}
