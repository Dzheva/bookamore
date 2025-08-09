package com.bookamore.backend.repository.spec;

import com.bookamore.backend.entity.Book;
import com.bookamore.backend.entity.BookAuthor;
import com.bookamore.backend.entity.Offer;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

public class OfferSpecification {

    public static Specification<Offer> sortByBookSimpleFieldCaseSensitive(Sort.Direction direction, String field) {
        return (root, query, cb) -> {

            assert query != null;

            Join<Offer, Book> book = root.join("book", JoinType.LEFT);
            Expression<String> ex = book.get(field);  // 'field' is a simple attribute of Book entity

            query.orderBy(
                    direction == Sort.Direction.ASC ? cb.asc(ex) : cb.desc(ex)
            );

            return cb.conjunction();
        };
    }

    public static Specification<Offer> sortByBookSimpleField(Sort.Direction direction, String field) {
        return (root, query, cb) -> {

            assert query != null;

            Join<Offer, Book> book = root.join("book", JoinType.LEFT);
            Expression<String> ex = cb.lower(book.get(field));  // 'field' is a STRING attribute of Book entity

            query.orderBy(
                    direction == Sort.Direction.ASC ? cb.asc(ex) : cb.desc(ex)
            );

            return cb.conjunction();
        };
    }

    public static Specification<Offer> sortByBookAuthorName(Sort.Direction direction) {
        return (root, query, cb) -> {

            assert query != null;

            Join<Offer, Book> book = root.join("book", JoinType.LEFT);
            Join<Book, BookAuthor> bookAuthor = book.join("authors", JoinType.LEFT);

            Expression<String> ex = cb.lower(bookAuthor.get("name"));

            query.orderBy(
                    direction == Sort.Direction.ASC ? cb.asc(ex) : cb.desc(ex)
            );

            return cb.conjunction();
        };
    }

}
