package com.bookamore.backend.mapper.book;

import com.bookamore.backend.entity.Book;
import com.bookamore.backend.entity.BookImage;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface BookImageMapper {

    default BookImage fromPath(String path) {
        BookImage bookImage = new BookImage();
        bookImage.setPath(path);
        return bookImage;
    }

    default String toPath(BookImage image) {
        return image.getPath();
    }

    List<BookImage> fromPaths(List<String> paths);

    List<String> toPaths(List<BookImage> images);

}
