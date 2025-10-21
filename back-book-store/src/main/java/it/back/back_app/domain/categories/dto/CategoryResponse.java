package it.back.back_app.domain.categories.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class CategoryResponse {
    private Long categoryId;
    private Long parentId;
    private String name;

    // 하위 카테고리 목록
    @Builder.Default
    private List<CategoryResponse> children = new ArrayList<>();
}
