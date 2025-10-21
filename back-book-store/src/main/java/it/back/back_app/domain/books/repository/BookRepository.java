package it.back.back_app.domain.books.repository;

import it.back.back_app.domain.books.entity.Book;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    @Query("""
        SELECT b FROM Book b
        WHERE (:keyword IS NULL OR b.title LIKE %:keyword% OR b.author LIKE %:keyword%)
          AND (:categoryId IS NULL OR b.categoryId = :categoryId)
        """)
    Page<Book> search(String keyword, Long categoryId, Pageable pageable);
}
