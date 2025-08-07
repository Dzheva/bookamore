package com.bookamore.backend.dto.mapper.book;

import com.bookamore.backend.dto.request.BookRequest;
import com.bookamore.backend.dto.response.BookResponse;
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
}
