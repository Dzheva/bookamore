package com.bookamore.backend.repository.spec;

import com.bookamore.backend.dto.offer.OfferFilter;
import com.bookamore.backend.entity.Book;
import com.bookamore.backend.entity.BookAuthor;
import com.bookamore.backend.entity.BookGenre;
import com.bookamore.backend.entity.Offer;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

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

    public static Specification<Offer> filterBy(OfferFilter filter) {
        return (root, query, cb) -> {
            if (filter == null) {
                return cb.conjunction();
            }

            if (query.getResultType() != Long.class && query.getResultType() != long.class) {
                query.distinct(true);
            }

            List<Predicate> predicates = new ArrayList<>();

            addSellerPredicate(predicates, root, filter.getSellerId());

            boolean hasGenreFilter = isCollectionValid(filter.getGenres());
            boolean hasAuthorFilter = isCollectionValid(filter.getAuthor());

            if (hasGenreFilter || hasAuthorFilter) {
                Join<Offer, Book> bookJoin = root.join("book");

                if (hasGenreFilter) {
                    addGenrePredicate(predicates, cb, bookJoin, filter.getGenres());
                }

                if (hasAuthorFilter) {
                    addAuthorPredicate(predicates, cb, bookJoin, filter.getAuthor());
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static void addSellerPredicate(List<Predicate> predicates, Root<Offer> root, List<UUID> sellerIds) {
        if (isCollectionValid(sellerIds)) {
            predicates.add(root.get("user").get("id").in(sellerIds));
        }
    }

    private static void addGenrePredicate(List<Predicate> predicates, CriteriaBuilder cb, Join<Offer, Book> bookJoin, List<String> genres) {
        Join<Book, BookGenre> genreJoin = bookJoin.join("genres");

        List<String> searchGenres = genres.stream()
                .map(String::toUpperCase)
                .toList();

        predicates.add(cb.upper(genreJoin.get("name")).in(searchGenres));
    }

    private static void addAuthorPredicate(List<Predicate> predicates, CriteriaBuilder cb, Join<Offer, Book> bookJoin, List<String> authors) {
        Join<Book, BookAuthor> bookAuthor = bookJoin.join("authors");
        List<Predicate> authorPredicates = new ArrayList<>();

        for (String authorName : authors) {
            if (authorName != null && !authorName.isBlank()) {
                authorPredicates.add(cb.like(
                        cb.lower(bookAuthor.get("name")),
                        "%" + authorName.toLowerCase() + "%"
                ));
            }
        }

        if (!authorPredicates.isEmpty()) {
            predicates.add(cb.or(authorPredicates.toArray(new Predicate[0])));
        }
    }

    private static boolean isCollectionValid(Collection<?> collection) {
        return collection != null && !collection.isEmpty();
    }

}
