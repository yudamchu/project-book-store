package it.back.back_app.domain.address.entity;

import it.back.back_app.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "addresses")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long addressId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String receiverName;

    @Column(nullable = false, length = 20)
    private String receiverPhone;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(length = 255)
    private String addressDetail;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isDefault = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
