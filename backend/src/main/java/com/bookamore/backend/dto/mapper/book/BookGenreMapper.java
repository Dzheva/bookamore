package com.bookamore.backend.dto.mapper.book;

import com.bookamore.backend.entity.BookGenre;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface BookGenreMapper {
    default BookGenre fromName(String name) {
        BookGenre genre = new BookGenre();
        genre.setName(name);
        return genre;
    }

    default String toName(BookGenre genre){
        return genre.getName();
    }

    List<BookGenre> fromNames(List<String> names);

    List<String> toNames(List<BookGenre> genres);
}
