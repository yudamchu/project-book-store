package it.back.back_app.domain.categories.controller;

import it.back.back_app.domain.categories.dto.*;
import it.back.back_app.domain.categories.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/categories")
public class CategoryController {

    private final CategoryService categoryService;

    //모두 접근 가능: 전체 또는 특정 상위카테고리 하위 조회 
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> list(
            @RequestParam(required = false) Long parentId
    ) {
        return ResponseEntity.ok(categoryService.findAll(parentId));
    }

    //모두 접근 가능: 단일 조회 
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.get(id));
    }

    //ADMIN 전용: 등록 
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CategoryResponse> create(@RequestBody CategoryRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.create(req));
    }

    //ADMIN 전용: 수정 
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CategoryResponse> update(
            @PathVariable Long id, @RequestBody CategoryRequest req
    ) {
        return ResponseEntity.ok(categoryService.update(id, req));
    }

    //ADMIN 전용: 삭제 
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

