package it.back.back_app.domain.bookReview.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserReviewRankingDTO {
    private Long userId;
    private String username;
    private int reviewCount;
}
