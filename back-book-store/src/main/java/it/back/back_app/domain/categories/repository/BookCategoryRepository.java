package it.back.back_app.domain.categories.repository;

import it.back.back_app.domain.categories.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookCategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByParentId(Long parentId);
    boolean existsByNameAndParentId(String name, Long parentId);
}
