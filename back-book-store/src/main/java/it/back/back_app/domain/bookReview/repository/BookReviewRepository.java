package it.back.back_app.domain.bookReview.repository;

import it.back.back_app.domain.bookReview.entity.BookReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookReviewRepository extends JpaRepository<BookReview, Long> {
    //도서별 
    @Query("SELECT r FROM BookReview r JOIN FETCH r.user WHERE r.book.bookId = :bookId ORDER BY r.createdAt DESC")
    List<BookReview> findByBookIdWithUser(@Param("bookId") Long bookId);

    //사용자별 리뷰 조회 
    @Query("SELECT r FROM BookReview r JOIN FETCH r.book WHERE r.user.userId = :userId")
    List<BookReview> findByUserIdWithBook(@Param("userId") Long userId);

    //이달의 랭킹
    @Query("""
    SELECT r.user.userId AS userId, 
       r.user.username AS username, 
       COUNT(r) AS reviewCount
    FROM BookReview r
    WHERE FUNCTION('MONTH', r.createdAt) = FUNCTION('MONTH', CURRENT_DATE)
    AND FUNCTION('YEAR', r.createdAt) = FUNCTION('YEAR', CURRENT_DATE)
    GROUP BY r.user.userId, r.user.username
    ORDER BY COUNT(r) DESC
    """)
    List<Object[]> findTopReviewersOfMonth();

}
