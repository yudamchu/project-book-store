package it.back.back_app.domain.books.service;

import it.back.back_app.domain.books.dto.*;
import it.back.back_app.domain.books.entity.Book;
import it.back.back_app.domain.books.repository.BookRepository;
import it.back.back_app.domain.categories.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    public Page<BookResponse> list(String keyword, Long categoryId, int page, int size, String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(
                sort != null && sort.equalsIgnoreCase("createdAt") ? Sort.Direction.DESC : Sort.Direction.ASC,
                sort != null ? sort : "bookId"
        ));
        return bookRepository.search(keyword, categoryId, pageable)
                .map(this::toResponse);
    }

    public BookResponse get(Long id) {
        return toResponse(
            bookRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("도서를 찾을 수 없습니다."))
        );
    }

    public BookResponse create(BookUpsertRequest req, List<MultipartFile> images) {
        validateCategory(req.getCategoryId());

        Book book = Book.builder()
                .title(req.getTitle())
                .author(req.getAuthor())
                .publisher(req.getPublisher())
                .publishedDate(req.getPublishedDate())
                .price(req.getPrice())
                .stock(req.getStock() == null ? 0 : req.getStock())
                .categoryId(req.getCategoryId())
                .description(req.getDescription())
                .isNew(Boolean.TRUE.equals(req.getIsNew()))
                .build();

        Book saved = bookRepository.save(book);


        return toResponse(saved);
    }

    public BookResponse update(Long id, BookUpsertRequest req, List<MultipartFile> images) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("도서를 찾을 수 없습니다."));

        if (req.getCategoryId() != null) validateCategory(req.getCategoryId());

        if (req.getTitle() != null) book.setTitle(req.getTitle());
        if (req.getAuthor() != null) book.setAuthor(req.getAuthor());
        if (req.getPublisher() != null) book.setPublisher(req.getPublisher());
        if (req.getPublishedDate() != null) book.setPublishedDate(req.getPublishedDate());
        if (req.getPrice() != null) book.setPrice(req.getPrice());
        if (req.getStock() != null) book.setStock(req.getStock());
        if (req.getCategoryId() != null) book.setCategoryId(req.getCategoryId());
        if (req.getDescription() != null) book.setDescription(req.getDescription());
        if (req.getIsNew() != null) book.setIsNew(req.getIsNew());

        Book saved = bookRepository.save(book);

        return toResponse(saved);
    }

    public void delete(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new IllegalArgumentException("이미 삭제되었거나 존재하지 않는 도서입니다.");
        }
        bookRepository.deleteById(id);
    }

    private void validateCategory(Long categoryId) {
        if (categoryId == null) return;
        if (!categoryRepository.existsByIdNative(categoryId)) {
            throw new IllegalArgumentException("유효하지 않은 카테고리입니다.");
        }
    }

    private BookResponse toResponse(Book b) {
        return BookResponse.builder()
                .bookId(b.getBookId())
                .title(b.getTitle())
                .author(b.getAuthor())
                .publisher(b.getPublisher())
                .publishedDate(b.getPublishedDate())
                .price(b.getPrice())
                .stock(b.getStock())
                .categoryId(b.getCategoryId())
                .description(b.getDescription())
                .isNew(b.getIsNew())
                .createdAt(b.getCreatedAt())
                .build();
    }
}

