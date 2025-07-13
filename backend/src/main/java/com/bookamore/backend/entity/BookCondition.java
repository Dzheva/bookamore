package com.bookamore.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "books_conditions")
@Data
public class BookCondition extends BaseEntity {
    @Column
    private String name;
}
