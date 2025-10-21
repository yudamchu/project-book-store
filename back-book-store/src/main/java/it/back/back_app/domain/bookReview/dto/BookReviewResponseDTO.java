package it.back.back_app.domain.bookReview.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookReviewResponseDTO {
    private Long reviewId;     // 리뷰 ID
    private Long bookId;       // 책 ID
    private Long userId;       // 작성자 ID
    private String username;   // 작성자 이름
    private Byte rating;       // 별점
    private String comment;    // 내용
    private Integer likes;     // 좋아요 수
    private String createdAt;  // 작성일
}
