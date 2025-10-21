package it.back.back_app.domain.categories.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories")
@Getter @Setter
@Builder
@NoArgsConstructor @AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;

    private Long parentId; // null이면 상위 카테고리

    @Column(nullable = false, length = 100)
    private String name;
}
