package it.back.back_app.domain.usedBookImage.entity;

import it.back.back_app.domain.usedbook.entity.UsedBook;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "used_book_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsedBookImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imageId;

    // 중고 도서 (FK) 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "used_book_id", nullable = false)
    private UsedBook usedBook;

    // 이미지 경로(URL) 
    @Column(nullable = false, length = 255)
    private String imageUrl;

    //정렬 순서 
    @Column(name = "sort_order", columnDefinition = "TINYINT")
    @Builder.Default
    private Byte sortOrder = 0;

    //업로드 일시 
    @Builder.Default
    private LocalDateTime uploadedAt = LocalDateTime.now();
}
