package com.bookamore.backend.dto.offer;

import com.bookamore.backend.entity.BookGenre;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfferFilter {
    private List<UUID> sellerId;
    private List<String> genres;
    private List<String> author;
}
