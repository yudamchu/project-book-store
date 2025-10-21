package it.back.back_app.domain.usedbook.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "used_books")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsedBook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long usedBookId;

    // 원본 도서 ID (FK)
    private Long bookId;

    // 판매자 ID (FK)
    @Column(nullable = false)
    private Long sellerId;

    @Column(nullable = false, length = 255)
    private String title; // 판매글 제목

    @Column(nullable = false)
    private Integer price;

     //  판매글 내용
    @Column(columnDefinition = "TEXT")
    private String description;

    // MariaDB 예약어 충돌 방지를 위해 백틱(`)으로 감싸줌
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "`condition`", length = 10)
    private Condition condition = Condition.중;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 10)
    private Status status = Status.판매중;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Condition {
        상, 중, 하
    }

    public enum Status {
        판매중, 거래완료
    }
}
