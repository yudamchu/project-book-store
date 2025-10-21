package it.back.back_app.domain.bookReview.controller;

import it.back.back_app.domain.bookReview.dto.BookReviewResponseDTO;
import it.back.back_app.domain.bookReview.dto.UserReviewRankingDTO;
import it.back.back_app.domain.bookReview.entity.BookReview;
import it.back.back_app.domain.bookReview.service.BookReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/book-reviews")
public class BookReviewController {

    private final BookReviewService bookReviewService;

    //1. 도서별 리뷰 조회 (모든 사용자 가능) *
    @GetMapping("/{bookId}")
    public ResponseEntity<List<BookReviewResponseDTO>> getReviews(@PathVariable Long bookId) {
        List<BookReview> reviews = bookReviewService.getReviews(bookId);

        // DTO 변환
        List<BookReviewResponseDTO> dtoList = reviews.stream()
                .map(r -> BookReviewResponseDTO.builder()
                        .reviewId(r.getReviewId())
                        .bookId(r.getBook().getBookId())
                        .userId(r.getUser().getUserId())
                        .username(r.getUser().getUsername())
                        .rating(r.getRating())
                        .comment(r.getComment())
                        .likes(r.getLikes())
                        .createdAt(r.getCreatedAt().toString())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }

    // 리뷰 등록 (USER만 가능) 
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/{bookId}")
    public ResponseEntity<String> createReview(
            @PathVariable Long bookId,
            @RequestParam Byte rating,
            @RequestParam String comment,
            Authentication auth) {

        bookReviewService.createReview(bookId, rating, comment, auth);
        return ResponseEntity.status(HttpStatus.CREATED).body("리뷰 등록 성공");
    }

    // 리뷰 수정 (USER 본인 or ADMIN) 
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{reviewId}")
    public ResponseEntity<String> updateReview(
        @PathVariable Long reviewId,
        @RequestParam Byte rating,
        @RequestParam String comment,
        @RequestParam(required = false) Integer likes,  
        Authentication auth) {

        bookReviewService.updateReview(reviewId, rating, comment, likes, auth); 
        return ResponseEntity.ok("리뷰 수정 완료");
    }

    //리뷰 삭제 (USER 본인 or ADMIN) 
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long reviewId,
            Authentication auth) {

        bookReviewService.deleteReview(reviewId, auth);
        return ResponseEntity.noContent().build();
    }

    // 특정 사용자의 리뷰 전체 조회 
    @GetMapping("/user/{userId}")
    @Transactional(readOnly = true)
    public ResponseEntity<List<BookReviewResponseDTO>> getReviewsByUser(@PathVariable Long userId) {
        List<BookReview> reviews = bookReviewService.getReviewsByUser(userId);

        List<BookReviewResponseDTO> dtoList = reviews.stream()
                .map(r -> BookReviewResponseDTO.builder()
                        .reviewId(r.getReviewId())
                        .bookId(r.getBook().getBookId())
                        .userId(r.getUser().getUserId())
                        .username(r.getUser().getUsername())
                        .rating(r.getRating())
                        .comment(r.getComment())
                        .likes(r.getLikes())
                        .createdAt(r.getCreatedAt().toString())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }

    // 이달의 독서왕 TOP10 조회
    @GetMapping("/ranking/monthly")
    public ResponseEntity<List<UserReviewRankingDTO>> getMonthlyTopReviewers() {
        return ResponseEntity.ok(bookReviewService.getMonthlyTopReviewers());
    }
}
