package it.back.back_app.domain.books.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "books")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookId;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(length = 100)
    private String author;

    @Column(length = 100)
    private String publisher;

    private LocalDate publishedDate;

    @Column(nullable = false)
    private Integer price;

    @Builder.Default
    private Integer stock = 0;

    // 카테고리 테이블 FK (단순 Long으로 매핑)
    private Long categoryId;

    @Lob
    private String description;

    @Builder.Default
    private Boolean isNew = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    //재고 차감 메서드 
    public void decreaseStock(int quantity) {
        if (this.stock < quantity) {
            throw new IllegalStateException("재고가 부족합니다: " + this.title);
        }
        this.stock -= quantity;
    }
}
