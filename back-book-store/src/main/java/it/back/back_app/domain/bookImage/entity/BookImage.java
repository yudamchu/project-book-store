package it.back.back_app.domain.bookImage.entity;

import it.back.back_app.domain.books.entity.Book;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "book_images")
@Getter @Setter
@Builder @NoArgsConstructor @AllArgsConstructor
public class BookImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(nullable = false)
    private String imageUrl;

    @Column(columnDefinition = "TINYINT")
    @Builder.Default
    private Byte sortOrder = 0;


    @Builder.Default
    private LocalDateTime uploadedAt = LocalDateTime.now();
}
