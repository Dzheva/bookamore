package com.bookamore.backend.dto.mapper.offer;

import com.bookamore.backend.dto.mapper.book.BookMapper;
import com.bookamore.backend.dto.request.BookRequest;
import com.bookamore.backend.dto.request.OfferRequest;
import com.bookamore.backend.dto.request.OfferUpdateRequest;
import com.bookamore.backend.dto.request.OfferWithBookRequest;
import com.bookamore.backend.dto.response.OfferResponse;
import com.bookamore.backend.dto.response.OfferWithBookResponse;
import com.bookamore.backend.entity.Book;
import com.bookamore.backend.entity.Offer;
import com.bookamore.backend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.MappingConstants;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        uses = BookMapper.class
)
public interface OfferMapper {

    @Mapping(target = "bookId", source = "book.id")
    @Mapping(target = "sellerId", source = "user.id")
    OfferResponse toResponse(Offer offer);

    @Mapping(target = "book", source = "bookId", qualifiedByName = "createBookFromId")
    @Mapping(target = "user", source = "sellerId", qualifiedByName = "createUserFromId")
    Offer toEntity(OfferRequest request);

    @Mapping(target = "book", source = "book")
    @Mapping(target = "sellerId", source = "user.id")
    OfferWithBookResponse toResponseWithBook(Offer offer);

    @Mapping(target = "book", source = "request")
    @Mapping(target = "user", source = "sellerId", qualifiedByName = "createUserFromId")
    Offer toEntity(OfferWithBookRequest request);

    Offer toEntity(OfferUpdateRequest request);

    Book toBookEntity(OfferWithBookRequest offerRequest);

    @Named("createBookFromId")
    default Book createBookFromId(Long id) {
        if (id == null) {
            return null;
        }
        Book book = new Book();
        book.setId(id);
        return book;
    }

    @Named("createUserFromId")
    default User createUserFromId(Long id) {
        if (id == null) {
            return null;
        }
        User user = new User();
        user.setId(id);
        return user;
    }
}
