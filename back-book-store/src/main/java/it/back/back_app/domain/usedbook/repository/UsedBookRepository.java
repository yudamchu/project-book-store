package it.back.back_app.domain.usedbook.repository;

import it.back.back_app.domain.usedbook.entity.UsedBook;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

@Repository
public interface UsedBookRepository extends JpaRepository<UsedBook, Long> {

    @Query("""
        SELECT u FROM UsedBook u
        WHERE (:bookId IS NULL OR u.bookId = :bookId)
        """)
    Page<UsedBook> search(Long bookId, Pageable pageable);
}
