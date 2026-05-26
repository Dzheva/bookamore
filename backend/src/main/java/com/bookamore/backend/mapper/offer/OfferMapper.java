package com.bookamore.backend.mapper.offer;

import com.bookamore.backend.dto.offer.*;
import com.bookamore.backend.entity.Book;
import com.bookamore.backend.entity.Offer;
import com.bookamore.backend.entity.User;
import com.bookamore.backend.mapper.book.BookMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.Named;

import java.util.UUID;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        uses = BookMapper.class
)
public interface OfferMapper {

    @Mapping(target = "bookId", source = "book.id")
    @Mapping(target = "seller", source = "user")
    OfferResponse toResponse(Offer offer);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    Seller toSeller(User user); // Helper method for mapping user to Seller DTO

    @Mapping(target = "book", source = "bookId", qualifiedByName = "createBookFromId")
    @Mapping(target = "user", source = "sellerId", qualifiedByName = "createUserFromId")
    Offer toEntity(OfferRequest request);

    @Mapping(target = "book", source = "book")
    @Mapping(target = "seller", source = "user")
    OfferWithBookResponse toResponseWithBook(Offer offer);

    @Mapping(target = "book", source = "request")
    @Mapping(target = "user", source = "sellerId", qualifiedByName = "createUserFromId")
    Offer toEntity(OfferWithBookRequest request);

    Offer toEntity(OfferUpdateRequest request);

    Book toBookEntity(OfferWithBookRequest offerRequest);

    @Named("createBookFromId")
    default Book createBookFromId(UUID id) {
        if (id == null) {
            return null;
        }
        Book book = new Book();
        book.setId(id);
        return book;
    }

    @Named("createUserFromId")
    default User createUserFromId(UUID id) {
        if (id == null) {
            return null;
        }
        User user = new User();
        user.setId(id);
        return user;
    }
}
