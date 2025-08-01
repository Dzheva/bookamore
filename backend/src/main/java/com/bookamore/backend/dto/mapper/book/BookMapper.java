package com.bookamore.backend.dto.mapper.book;

import com.bookamore.backend.dto.request.BookRequest;
import com.bookamore.backend.dto.response.BookResponse;
import com.bookamore.backend.entity.Book;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        uses = {
                BookAuthorMapper.class, BookGenreMapper.class, BookImageMapper.class
        }
)
public interface BookMapper {

    @Mapping(source = "bookCondition", target = "condition")
    BookResponse toResponse(Book book);

    @Mapping(source = "condition", target = "bookCondition")
    Book toEntity(BookRequest bookRequest);
}
