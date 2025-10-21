package it.back.back_app.domain.bookImage.repository;

import it.back.back_app.domain.bookImage.entity.BookImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookImageRepository extends JpaRepository<BookImage, Long> {

    //도서별 이미지 조회 (정렬순)
    List<BookImage> findByBook_BookIdOrderBySortOrder(Long bookId);
}