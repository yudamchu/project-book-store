package it.back.back_app.domain.bookReview.entity;

import it.back.back_app.domain.books.entity.Book;
import it.back.back_app.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter @Setter
@Builder @NoArgsConstructor @AllArgsConstructor
public class BookReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Byte rating;

    @Lob
    private String comment;

    @Builder.Default
    private int likes = 0;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
