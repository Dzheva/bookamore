package com.bookamore.backend.mapper.book;

import com.bookamore.backend.dto.book.BookRequest;
import com.bookamore.backend.dto.book.BookResponse;
import com.bookamore.backend.dto.book.BookUpdateRequest;
import com.bookamore.backend.entity.Book;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        uses = {
                BookAuthorMapper.class, BookGenreMapper.class, BookImageMapper.class
        }
)
public interface BookMapper {

    BookResponse toResponse(Book book);

    Book toEntity(BookRequest bookRequest);

    Book toEntity(BookUpdateRequest bookUpdateRequest);
}
