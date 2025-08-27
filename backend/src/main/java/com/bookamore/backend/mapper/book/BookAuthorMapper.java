package com.bookamore.backend.mapper.book;

import com.bookamore.backend.entity.BookAuthor;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface BookAuthorMapper {
    default BookAuthor fromName(String name) {
        BookAuthor author = new BookAuthor();
        author.setName(name);
        return author;
    }

    default String toName(BookAuthor author) {
        return author.getName();
    }

    List<BookAuthor> fromNames(List<String> names);

    List<String> toNames(List<BookAuthor> authors);
}
