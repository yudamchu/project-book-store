package it.back.back_app.domain.usedBookImage.repository;

import it.back.back_app.domain.usedBookImage.entity.UsedBookImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UsedBookImageRepository extends JpaRepository<UsedBookImage, Long> {
    List<UsedBookImage> findByUsedBook_UsedBookIdOrderBySortOrder(Long usedBookId);
    boolean existsByUsedBook_UsedBookIdAndSortOrder(Long usedBookId, Byte sortOrder); 
}
