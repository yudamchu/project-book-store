package it.back.back_app.domain.usedbook.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class UsedBookUpsertRequest {
    private Long bookId;
    private Long sellerId;
    private String title; 
    private Integer price;
    private String condition; // "상", "중", "하"
    private String status;    // "판매중", "거래완료"
    private String description;
}
