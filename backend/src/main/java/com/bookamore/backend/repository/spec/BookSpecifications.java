package com.bookamore.backend.repository;

import com.bookamore.backend.entity.Book;
import com.bookamore.backend.entity.BookAuthor;
import com.bookamore.backend.entity.BookGenre;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

public class BookSpecifications {
    public static Specification<Book> sortByAuthorName(Sort.Direction direction) {
        return (root, query, cb) -> {
            Join<Book, BookAuthor> authors = root.join("authors", JoinType.LEFT);
            assert query != null;
            query.orderBy(
                    direction == Sort.Direction.ASC ?
                            cb.asc(cb.lower(authors.get("name"))) :
                            cb.desc(cb.lower(authors.get("name")))
            );
            return cb.conjunction();
        };
    }

    public static Specification<Book> sortByGenreName(Sort.Direction direction) {
        return (root, query, cb) -> {
            Join<Book, BookGenre> genres = root.join("genres", JoinType.LEFT);
            assert query != null;
            query.groupBy(root.get("id"));
            query.orderBy(
                    direction == Sort.Direction.ASC ?
                            cb.asc(cb.lower(genres.get("name"))) :
                            cb.desc(cb.lower(genres.get("name")))
            );
            return cb.conjunction();
        };
    }
}
