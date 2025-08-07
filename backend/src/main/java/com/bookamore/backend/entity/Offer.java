package com.bookamore.backend.entity;

import com.bookamore.backend.entity.enums.OfferStatus;
import com.bookamore.backend.entity.enums.OfferType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@Entity
@Table(name = "offers")
@EqualsAndHashCode(callSuper = false)
public class Offer extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User user;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true, optional = false)
    @JoinColumn(name = "book_id", nullable = false, unique = true)
    private Book book;

    @Column(length = 500)
    private String description;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column
    private String previewImage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OfferType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OfferStatus status;
}
