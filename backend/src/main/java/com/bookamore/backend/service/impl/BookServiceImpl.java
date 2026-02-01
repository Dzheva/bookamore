package com.bookamore.backend.service.impl;

import com.bookamore.backend.dto.book.BookRequest;
import com.bookamore.backend.dto.book.BookResponse;
import com.bookamore.backend.dto.book.BookUpdateRequest;
import com.bookamore.backend.entity.Book;
import com.bookamore.backend.entity.BookAuthor;
import com.bookamore.backend.entity.BookGenre;
import com.bookamore.backend.entity.BookImage;
import com.bookamore.backend.entity.enums.BookCondition;
import com.bookamore.backend.exception.ResourceNotFoundException;
import com.bookamore.backend.mapper.book.BookMapper;
import com.bookamore.backend.repository.BookAuthorRepository;
import com.bookamore.backend.repository.BookGenreRepository;
import com.bookamore.backend.repository.BookRepository;
import com.bookamore.backend.service.BookService;
import com.bookamore.backend.service.ImageService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {
    private final BookRepository bookRepository;
    private final BookGenreRepository bookGenreRepository;
    private final BookAuthorRepository bookAuthorRepository;
    private final BookMapper bookMapper;

    private final ImageService imageService;

    @Value("${file.sub-dirs.books-images}")
    private String bookImagesSubDir;

    private static final int BOOK_IMAGES_MAX_COUNT = 4;

    @Transactional
    public Book createBook(BookRequest bookRequest) {
        Book book = bookMapper.toEntity(bookRequest);

        resolveReferences(book);

        return bookRepository.save(book);
    }

    @Transactional
    public BookResponse create(BookRequest bookRequest) {
        return bookMapper.toResponse(createBook(bookRequest));
    }

    private List<BookAuthor> resolveAuthors(Book book) {
        List<BookAuthor> managedAuthors = new ArrayList<>();
        for (BookAuthor author : book.getAuthors()) {
            String authorName = author.getName();
            bookAuthorRepository.findByName(authorName).ifPresentOrElse(
                    existedAuthor -> {
                        existedAuthor.getBooks().add(book);
                        managedAuthors.add(existedAuthor);
                    },
                    () -> {
                        // new Author
                        managedAuthors.add(
                                bookAuthorRepository.save(author)
                        );
                    }
            );
        }

        return managedAuthors;
    }

    private List<BookGenre> resolveGenres(Book book) {
        List<BookGenre> managedGenres = new ArrayList<>();
        for (BookGenre genre : book.getGenres()) {
            String genreName = genre.getName();
            bookGenreRepository.findByName(genreName).ifPresentOrElse(
                    existedGenre -> {
                        existedGenre.getBooks().add(book);
                        managedGenres.add(existedGenre);
                    },
                    () -> {
                        // new Genre
                        managedGenres.add(
                                bookGenreRepository.save(genre)
                        );
                    }
            );
        }
        return managedGenres;
    }

    private List<BookImage> resolveImages(Book book) {
        List<BookImage> managedImages = new ArrayList<>();
        for (BookImage image : book.getImages()) {
            String path = image.getPath();
            BookImage newImage = new BookImage();
            newImage.setPath(path);
            newImage.setBook(book);
            managedImages.add(newImage);
        }
        return managedImages;
    }

    private void resolveReferences(Book book) {

        book.setAuthors(resolveAuthors(book));

        book.setGenres(resolveGenres(book));

        book.setImages(resolveImages(book));
    }

    public Book getBookEntityById(UUID bookId) {
        return bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + bookId));
    }

    public BookResponse getById(UUID bookId) {
        return bookMapper.toResponse(
                getBookEntityById(bookId)
        );
    }

    @Transactional
    public BookResponse update(UUID bookId, BookUpdateRequest bookUpdateRequest) {
        Book existingBook = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + bookId));

        Book patch = bookMapper.toEntity(bookUpdateRequest);


        boolean simpleFieldsModified = updateSimpleFields(existingBook, patch);

        boolean childrenModified = false;

        childrenModified |= updateAuthors(existingBook, patch);

        childrenModified |= updateGenres(existingBook, patch);

        boolean anyModified = childrenModified | simpleFieldsModified;

        if (anyModified) {
            if (childrenModified) {
                // Update lastModifiedDate only when child entities are modified
                existingBook.setLastModifiedDate(LocalDateTime.now());
            }
            Book savedBook = bookRepository.save(existingBook);  // save modified book
            return bookMapper.toResponse(savedBook);
        }

        return bookMapper.toResponse(existingBook);
    }

    private boolean updateSimpleFields(Book existingBook, Book patch) {
        boolean isModified = false;

        String newTitle = patch.getTitle();
        String newDesc = patch.getDescription();
        String newIsbn = patch.getIsbn();
        BookCondition newCondition = patch.getCondition();

        if (newTitle != null && !newTitle.equals(existingBook.getTitle())) {
            existingBook.setTitle(newTitle);
            isModified = true;
        }

        if (newDesc != null && !newDesc.equals(existingBook.getDescription())) {
            existingBook.setDescription(newDesc);
            isModified = true;
        }

        if (newIsbn != null && !newIsbn.equals(existingBook.getIsbn())) {
            existingBook.setIsbn(newIsbn);
            isModified = true;
        }

        if (newCondition != null && !newCondition.equals(existingBook.getCondition())) {
            existingBook.setCondition(newCondition);
            isModified = true;
        }

        return isModified;
    }

    private boolean updateAuthors(Book existingBook, Book patch) {
        List<BookAuthor> patchAuthors = patch.getAuthors();

        if (patchAuthors == null || patchAuthors.equals(existingBook.getAuthors())) {
            return false;
        }
        if (patchAuthors.stream().anyMatch(a -> a.getName() == null || a.getName().isBlank())) {
            throw new IllegalArgumentException("One or more provided authors has no name " +
                    "(name == null or name is blank)");
        }

        Set<String> patchAuthorsNames = patchAuthors.stream().map(BookAuthor::getName).collect(Collectors.toSet());

        List<BookAuthor> existingAuthors = existingBook.getAuthors();
        existingAuthors.removeIf(author -> !patchAuthorsNames.contains(author.getName())); // unassign author

        Set<String> existingAuthorsNames = existingAuthors.stream()
                .map(BookAuthor::getName).collect(Collectors.toSet());

        for (String authorName : patchAuthorsNames) {
            if (existingAuthorsNames.contains(authorName)) {
                continue;
            }

            // assign existing author to book
            bookAuthorRepository.findByName(authorName).ifPresentOrElse(
                    existingAuthors::add,
                    () -> {
                        BookAuthor newAuthor = new BookAuthor();
                        newAuthor.setName(authorName);
                        existingAuthors.add(newAuthor);  // assign new author
                        bookAuthorRepository.save(newAuthor);
                    }
            );
        }
        return true;
    }

    private boolean updateGenres(Book existingBook, Book patch) {

        List<BookGenre> patchGenres = patch.getGenres();
        if (patchGenres == null || patchGenres.equals(existingBook.getGenres())) {
            return false;
        }
        if (patchGenres.stream().anyMatch(g -> g.getName() == null || g.getName().isBlank())) {
            throw new IllegalArgumentException("One or more provided genres has no name "
                    + "(name == null or name is blank)");
        }

        Set<String> patchGenresNames = patchGenres.stream().map(BookGenre::getName).collect(Collectors.toSet());

        List<BookGenre> existingGenres = existingBook.getGenres();
        existingGenres.removeIf(genre -> !patchGenresNames.contains(genre.getName()));  // unassign genres

        Set<String> existingGenresNames = existingGenres.stream()
                .map(BookGenre::getName).collect(Collectors.toSet());

        for (String genreName : patchGenresNames) {
            if (existingGenresNames.contains(genreName)) {
                continue;
            }

            // assign existing genre to book
            bookGenreRepository.findByName(genreName).ifPresentOrElse(
                    existingGenres::add,
                    () -> {
                        BookGenre newGenre = new BookGenre();
                        newGenre.setName(genreName);
                        existingGenres.add(newGenre);  // assign new genre
                        bookGenreRepository.save(newGenre);
                    }
            );
        }

        return true;
    }

    /*
     * Book Images Service Part
     */

    @Transactional
    public List<String> saveImages(UUID bookId, List<MultipartFile> images) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + bookId));

        List<BookImage> bookImages = book.getImages();

        if (images.size() > BOOK_IMAGES_MAX_COUNT) {
            throw new IllegalArgumentException("Too many images provided!"); // TODO improve message
        } else if (!bookImages.isEmpty() && (bookImages.size() + images.size()) > BOOK_IMAGES_MAX_COUNT) {
            throw new IllegalArgumentException("Too many images provided!"); // TODO improve message
        }

        for (MultipartFile image : images) {
            String savedImagePath = imageService.saveImage(image, this.bookImagesSubDir);

            BookImage bookImage = new BookImage();
            bookImage.setBook(book);
            bookImage.setPath(savedImagePath);

            bookImages.add(bookImage);
        }

        book.setImages(bookImages);
        bookRepository.save(book);

        return bookImages.stream().map(BookImage::getPath).toList();
    }

    @Transactional
    public List<String> replaceImages(UUID bookId, List<MultipartFile> images) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + bookId));

        List<BookImage> bookImages = book.getImages();

        // check count of provided images
        if (images.size() > BOOK_IMAGES_MAX_COUNT) {
            throw new IllegalArgumentException("Too many images provided!"); // TODO improve message
        }

        // remove old images
        for (BookImage imageToRemove : new ArrayList<>(bookImages)) {

            String path = imageToRemove.getPath();
            String fileName = path.substring(path.lastIndexOf('/') + 1);

            try {
                imageService.deleteImage(fileName, this.bookImagesSubDir);
            } catch (Exception ex) {
                log.warn(String.format("An error occurred while deleting image '%s' at subdirectory '%s' : %s",
                        path, this.bookImagesSubDir, ex));
            }

            bookImages.remove(imageToRemove);
        }

        // save new images
        for (MultipartFile image : images) {
            String savedImagePath = imageService.saveImage(image, this.bookImagesSubDir);

            BookImage bookImage = new BookImage();
            bookImage.setBook(book);
            bookImage.setPath(savedImagePath);

            bookImages.add(bookImage);
        }
        book.setImages(bookImages);
        bookRepository.save(book);

        return bookImages.stream().map(BookImage::getPath).toList();
    }

    @Transactional
    public void deleteImage(UUID bookId, String imagePath) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + bookId));

        List<BookImage> bookImages = book.getImages();

        BookImage bookImage = bookImages.stream().filter(i -> i.getPath().equals(imagePath)).findFirst()
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("Book with ID %d does not have an image with the path '%s'", bookId, imagePath)
                ));

        String fileName = imagePath.substring(imagePath.lastIndexOf('/') + 1);
        try {
            imageService.deleteImage(fileName, this.bookImagesSubDir);
        } catch (Exception ex) {
            log.warn(String.format("An error occurred while deleting image '%s' at subdirectory '%s' : %s",
                    imagePath, this.bookImagesSubDir, ex));
        }

        bookImages.remove(bookImage);
        bookRepository.save(book);
    }
}