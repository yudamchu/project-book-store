package it.back.back_app.domain.books.controller;

import it.back.back_app.domain.books.dto.*;
import it.back.back_app.domain.books.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/books")
public class BookController {

    private final BookService bookService;

    //모두 접근 가능: 메인 화면 목록 조회 
    @GetMapping
    public ResponseEntity<Page<BookResponse>> list(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String sort // "createdAt" 등
    ) {
        return ResponseEntity.ok(bookService.list(keyword, categoryId, page, size, sort));
    }

    //모두 접근 가능: 상세 조회 
    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.get(id));
    }

    //ADMIN 전용: 등록 (multipart/form-data) 
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BookResponse> create(
            @RequestPart("book") BookUpsertRequest book,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookService.create(book, images));
    }

    //ADMIN 전용: 수정 (multipart/form-data) 
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BookResponse> update(
            @PathVariable Long id,
            @RequestPart("book") BookUpsertRequest book,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        return ResponseEntity.ok(bookService.update(id, book, images));
    }

    //ADMIN 전용: 삭제 
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
