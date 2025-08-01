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
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

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
                        managedAuthors.add(author);
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
                        managedGenres.add(genre);
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

    public Page<BookResponse> getPageAllBooks(Integer page, Integer size, String sortBy, String direction) {
        Sort sort = Sort.by(sortBy);

        if (direction.equals(Sort.Direction.ASC.name()))
            sort.ascending();
        else
            sort.descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return bookRepository.findAll(pageable).map(bookMapper::toResponse);
    }

    public BookResponse getById(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + bookId));
        return bookMapper.toResponse(book);
    }

    public Optional<BookResponse> update(Long bookId, BookRequest bookRequest) {
        Book existingBook = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + bookId));

        Book book = bookMapper.toEntity(bookRequest);

        String newTitle = book.getTitle();
        String newDesc = book.getDescription();
        String newIsbn = book.getIsbn();
        BookCondition newCondition = book.getBookCondition();
        List<BookAuthor> newAuthors = book.getAuthors();
        List<BookGenre> newGenres = book.getGenres();
        List<BookImage> newImages = book.getImages();
        LocalDateTime lastModifiedDate = book.getLastModifiedDate();
        boolean isModified = false;

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

        if (newCondition != null && !newCondition.equals(existingBook.getBookCondition())) {
            existingBook.setBookCondition(newCondition);
            isModified = true;
        }

        if (newAuthors != null && !newAuthors.equals(existingBook.getAuthors())) {
            existingBook.setAuthors(newAuthors);
            isModified = true;
        }

        if (newGenres != null && !newGenres.equals(existingBook.getGenres())) {

            if (newGenres.stream().anyMatch(g -> g.getName() == null)) {
                throw new IllegalArgumentException("One or more provided genres has no name (name == null)");
            }

            Set<String> newGenresNames = newGenres.stream().map(BookGenre::getName).collect(Collectors.toSet());

            List<BookGenre> existingGenres = existingBook.getGenres();
            existingGenres.removeIf(genre -> !newGenresNames.contains(genre.getName()));  // remove old genre

            Set<String> existingGenresNames = existingGenres.stream()
                    .map(BookGenre::getName).collect(Collectors.toSet());

            for (String genreName : newGenresNames) {
                if (!existingGenresNames.contains(genreName)){
                    bookGenreRepository.findByName(genreName).ifPresentOrElse(
                            existedGenre -> {
                                existedGenre.getBooks().add(book);
                                existingGenres.add(existedGenre);
                            },
                            () -> {
                                BookGenre newGenre = new BookGenre();
                                newGenre.setName(genreName);
                                newGenre.getBooks().add(existingBook);
                                existingGenres.add(newGenre);  // add new genre
                            }
                    );
                }
            }

            isModified = true;
        }

        if (newImages != null && !newImages.equals(existingBook.getImages())) {

            Set<String> newPaths = newImages.stream().map(BookImage::getPath).collect(Collectors.toSet());

            List<BookImage> existingImages = existingBook.getImages();
            existingImages.removeIf(image -> !newPaths.contains(image.getPath()));  // remove old image

            Set<String> existingPaths = existingImages.stream()
                    .map(BookImage::getPath).collect(Collectors.toSet());

            for (String path : newPaths) {
                if (!existingPaths.contains(path)) {
                    BookImage newImage = new BookImage();
                    newImage.setPath(path);
                    newImage.setBook(existingBook);
                    existingImages.add(newImage);  // add new image
                }
            }

            isModified = true;
        }

        if (isModified) {
            existingBook.setLastModifiedDate(lastModifiedDate);
            BookResponse savedBook = bookMapper.toResponse(bookRepository.save(existingBook));
            return Optional.of(savedBook);
        }

        return Optional.empty();
    }

    public boolean delete(Long bookId) {
        return bookRepository.findById(bookId).map(
                book -> {
                    bookRepository.delete(book);
                    return true;
                }
        ).orElse(false);
    }


}
