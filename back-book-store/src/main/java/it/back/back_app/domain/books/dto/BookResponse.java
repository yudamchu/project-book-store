package it.back.back_app.domain.books.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class BookResponse {
    private Long bookId;
    private String title;
    private String author;
    private String publisher;
    private LocalDate publishedDate;
    private Integer price;
    private Integer stock;
    private Long categoryId;
    private String description;
    private Boolean isNew;
    private LocalDateTime createdAt;
}
