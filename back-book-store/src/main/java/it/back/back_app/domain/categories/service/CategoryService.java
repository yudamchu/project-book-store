package it.back.back_app.domain.categories.service;

import it.back.back_app.domain.categories.dto.*;
import it.back.back_app.domain.categories.entity.Category;
import it.back.back_app.domain.categories.repository.BookCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final BookCategoryRepository categoryRepository;

    public List<CategoryResponse> findAll(Long parentId) {
        List<Category> all = categoryRepository.findAll();
        return buildCategoryTree(all, parentId);
    }

    private List<CategoryResponse> buildCategoryTree(List<Category> all, Long parentId) {
        return all.stream()
            .filter(c -> Objects.equals(c.getParentId(), parentId))
            .map(c -> {
                CategoryResponse res = toResponse(c);
                res.setChildren(buildCategoryTree(all, c.getCategoryId())); // 재귀
                return res;
            })
            .collect(Collectors.toList());
    }

    public CategoryResponse get(Long id) {
        List<Category> all = categoryRepository.findAll();

        // 해당 카테고리 찾기
        Category category = all.stream()
            .filter(c -> c.getCategoryId().equals(id))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));

        // 해당 카테고리 기준으로 하위까지 트리 구성
        return buildCategoryTreeForSingle(category, all);
    }

    private CategoryResponse buildCategoryTreeForSingle(Category category, List<Category> all) {
        CategoryResponse res = toResponse(category);

        List<CategoryResponse> children = all.stream()
            .filter(c -> Objects.equals(c.getParentId(), category.getCategoryId()))
            .map(c -> buildCategoryTreeForSingle(c, all))
            .collect(Collectors.toList());

        res.setChildren(children);
        return res;
    }

    public CategoryResponse create(CategoryRequest req) {
        if (categoryRepository.existsByNameAndParentId(req.getName(), req.getParentId())) {
            throw new IllegalArgumentException("이미 존재하는 카테고리 이름입니다.");
        }
        Category c = Category.builder()
                .name(req.getName())
                .parentId(req.getParentId())
                .build();
        return toResponse(categoryRepository.save(c));
    }

    public CategoryResponse update(Long id, CategoryRequest req) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));
        if (req.getName() != null) c.setName(req.getName());
        if (req.getParentId() != null) c.setParentId(req.getParentId());
        return toResponse(categoryRepository.save(c));
    }

    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException("이미 삭제되었거나 존재하지 않는 카테고리입니다.");
        }
        categoryRepository.deleteById(id);
    }

    

    private CategoryResponse toResponse(Category c) {
        return CategoryResponse.builder()
                .categoryId(c.getCategoryId())
                .parentId(c.getParentId())
                .name(c.getName())
                .build();
    }
}
