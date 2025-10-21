package it.back.back_app.domain.usedbook.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class UsedBookResponse {
    private Long usedBookId;
    private Long bookId;
    private Long sellerId;
    private String title; 
    private Integer price;
    private String condition;
    private String status;
    private String description;
    private LocalDateTime createdAt;
    private String sellerName;     // 판매자 이름 (Users.username)
    private Integer originalPrice; // 도서 정가 (Books.price)
}
