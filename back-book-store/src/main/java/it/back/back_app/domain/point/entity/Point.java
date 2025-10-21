package it.back.back_app.domain.point.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import it.back.back_app.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "points")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Point {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pointId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ChangeType changeType;

    @Column(nullable = false)
    private Integer points;

    @Column(nullable = false)
    private Integer balance;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum ChangeType {
        리뷰, 충전, 결제차감, 환불
    }
}
