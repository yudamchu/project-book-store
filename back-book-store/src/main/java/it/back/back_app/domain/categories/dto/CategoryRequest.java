package it.back.back_app.domain.categories.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class CategoryRequest {
    private Long parentId;
    private String name;
}

