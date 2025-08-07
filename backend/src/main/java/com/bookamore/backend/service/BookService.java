package com.bookamore.backend.service;

import com.bookamore.backend.dto.mapper.book.BookMapper;
import com.bookamore.backend.dto.request.BookRequest;
import com.bookamore.backend.dto.response.BookResponse;
import com.bookamore.backend.entity.Book;
import com.bookamore.backend.entity.BookAuthor;
import com.bookamore.backend.entity.BookGenre;
import com.bookamore.backend.entity.BookImage;
import com.bookamore.backend.entity.enums.BookCondition;
import com.bookamore.backend.repository.BookAuthorRepository;
import com.bookamore.backend.repository.BookGenreRepository;
import com.bookamore.backend.repository.BookRepository;
import com.bookamore.backend.repository.BookSpecifications;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;
    private final BookGenreRepository bookGenreRepository;
    private final BookAuthorRepository bookAuthorRepository;
    private final BookMapper bookMapper;

    @Transactional
    public BookResponse create(BookRequest bookRequest) {
        Book book = bookMapper.toEntity(bookRequest);

        resolveReferences(book);

        book = bookRepository.save(book);

        return bookMapper.toResponse(book);
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

    public List<BookResponse> createList(List<BookRequest> bookRequestList) {
        List<BookResponse> createdBooks = new ArrayList<>();

        for (BookRequest bookRequest : bookRequestList) {
            createdBooks.add(create(bookRequest));
        }

        return createdBooks;
    }

    public List<BookResponse> getAll() {
        return bookRepository.findAll().stream()
                .map(bookMapper::toResponse).collect(Collectors.toList());
    }

    public Page<BookResponse> getPageAllBooks(Integer page, Integer size, String sortBy, String sortDir) {
        Sort.Direction direction = Sort.Direction.fromString(sortDir);
        Pageable pageable = PageRequest.of(page, size);

        if ("authorName".equalsIgnoreCase(sortBy)) {
            return bookRepository.findAll(
                    BookSpecifications.sortByAuthorName(direction),
                    pageable
            ).map(bookMapper::toResponse);
        }

        Sort sort = Sort.by(direction, sortBy);
        pageable = PageRequest.of(page, size, sort);
        return bookRepository.findAll(pageable).map(bookMapper::toResponse);
    }

    public BookResponse getById(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + bookId));
        return bookMapper.toResponse(book);
    }

    @Transactional
    public Optional<BookResponse> update(Long bookId, BookRequest bookRequest) {
        Book existingBook = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + bookId));

        Book patch = bookMapper.toEntity(bookRequest);


        boolean simpleFieldsModified = updateSimpleFields(existingBook, patch);

        boolean childrenModified = false;

        childrenModified |= updateAuthors(existingBook, patch);

        childrenModified |= updateGenres(existingBook, patch);

        childrenModified |= updateImages(existingBook, patch);

        boolean anyModified = childrenModified | simpleFieldsModified;

        if (anyModified) {
            if (childrenModified) {
                // Update lastModifiedDate only when child entities are modified
                existingBook.setLastModifiedDate(LocalDateTime.now());
            }
            Book savedBook = bookRepository.save(existingBook);  // save modified book
            BookResponse savedBookResponse = bookMapper.toResponse(savedBook);
            return Optional.of(savedBookResponse);
        }

        return Optional.empty();
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

    private boolean updateImages(Book existingBook, Book patch) {

        List<BookImage> patchImages = patch.getImages();

        if (patchImages == null || patchImages.equals(existingBook.getImages())) {
            return false;
        }
        if (patchImages.stream().anyMatch(i -> i.getPath() == null)) {
            throw new IllegalArgumentException("One or more provided images has no name (path == null)");
        }

        Set<String> patchPaths = patchImages.stream().map(BookImage::getPath).collect(Collectors.toSet());

        List<BookImage> existingImages = existingBook.getImages();
        existingImages.removeIf(image -> !patchPaths.contains(image.getPath()));  // remove old image

        Set<String> existingPaths = existingImages.stream()
                .map(BookImage::getPath).collect(Collectors.toSet());

        for (String path : patchPaths) {
            if (existingPaths.contains(path)) {
                continue;
            }

            BookImage newImage = new BookImage();
            newImage.setPath(path);
            newImage.setBook(existingBook);
            existingImages.add(newImage);  // add new image
        }

        return true;
    }

    @Transactional
    public boolean delete(Long bookId) {
        return bookRepository.findById(bookId).map(
                book -> {
                    bookRepository.delete(book);
                    return true;
                }
        ).orElse(false);
    }

}
