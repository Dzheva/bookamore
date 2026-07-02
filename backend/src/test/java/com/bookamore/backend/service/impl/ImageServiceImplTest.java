package com.bookamore.backend.service.impl;

import com.bookamore.backend.entity.Image;
import com.bookamore.backend.entity.enums.EntityType;
import com.bookamore.backend.repository.BookRepository;
import com.bookamore.backend.repository.ImageRepository;
import com.bookamore.backend.repository.ImageStorageRepository;
import com.bookamore.backend.service.BookService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ImageServiceImplTest {

    @Mock
    private ImageRepository imageRepository;
    @Mock
    private ImageStorageRepository imageLocalStorageRepository;
    @Mock
    private BookRepository bookRepository;
    @Mock
    private BookService bookService;

    @InjectMocks
    private ImageServiceImpl imageService;

    /**
     * Regression test for the production delete bug: when the physical file is already
     * gone from disk, deletion must still remove the DB records and must not throw.
     */
    @Test
    void deleteImage_whenPhysicalFileMissing_stillRemovesDbRecordsWithoutThrowing() throws IOException {
        UUID imageId = UUID.randomUUID();
        UUID bookId = UUID.randomUUID();
        String path = "/img/book/missing.jpg";

        Image image = new Image();
        image.setId(imageId);
        image.setPath(path);
        image.setEntityType(EntityType.BOOK);
        image.setEntityId(bookId);

        when(imageRepository.findById(imageId)).thenReturn(Optional.of(image));
        when(bookRepository.existsById(bookId)).thenReturn(true);
        // deleteIfExists() semantics: file already absent -> returns false, no exception
        when(imageLocalStorageRepository.deleteImage("missing.jpg", "book")).thenReturn(false);

        assertThatCode(() -> imageService.deleteImage(imageId)).doesNotThrowAnyException();

        verify(bookService).removeImage(bookId, path);
        verify(imageRepository).delete(image);
    }

    /**
     * Even a genuine I/O error while deleting the physical file must not roll back the
     * DB removal, since the database is treated as the source of truth.
     */
    @Test
    void deleteImage_whenStorageThrowsIoError_stillRemovesDbRecords() throws IOException {
        UUID imageId = UUID.randomUUID();
        UUID bookId = UUID.randomUUID();
        String path = "/img/book/broken.jpg";

        Image image = new Image();
        image.setId(imageId);
        image.setPath(path);
        image.setEntityType(EntityType.BOOK);
        image.setEntityId(bookId);

        when(imageRepository.findById(imageId)).thenReturn(Optional.of(image));
        when(bookRepository.existsById(bookId)).thenReturn(true);
        when(imageLocalStorageRepository.deleteImage("broken.jpg", "book"))
                .thenThrow(new IOException("disk error"));

        assertThatCode(() -> imageService.deleteImage(imageId)).doesNotThrowAnyException();

        verify(bookService).removeImage(bookId, path);
        verify(imageRepository).delete(image);
    }

    /**
     * Orphaned image: entity_id points to a book that was already deleted. The association
     * cleanup must be skipped (never call removeImage, which would poison the transaction),
     * and the images record must still be removed so the dead row can be cleaned up.
     */
    @Test
    void deleteImage_whenParentBookMissing_skipsAssociationAndStillDeletesImageRecord() throws IOException {
        UUID imageId = UUID.randomUUID();
        UUID missingBookId = UUID.randomUUID();
        String path = "/img/book/orphan.jpg";

        Image image = new Image();
        image.setId(imageId);
        image.setPath(path);
        image.setEntityType(EntityType.BOOK);
        image.setEntityId(missingBookId);

        when(imageRepository.findById(imageId)).thenReturn(Optional.of(image));
        when(bookRepository.existsById(missingBookId)).thenReturn(false);
        when(imageLocalStorageRepository.deleteImage("orphan.jpg", "book")).thenReturn(false);

        assertThatCode(() -> imageService.deleteImage(imageId)).doesNotThrowAnyException();

        verify(bookService, never()).removeImage(any(), any());
        verify(imageRepository).delete(image);
    }
}
