package it.back.back_app.domain.point.repository;

import it.back.back_app.domain.point.entity.Point;
import it.back.back_app.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PointRepository extends JpaRepository<Point, Long> {

    // 특정 사용자 포인트 내역 (최신순) 
    List<Point> findByUserOrderByCreatedAtDesc(User user);

    // 최근 잔액 확인용 
    Optional<Point> findTopByUserOrderByCreatedAtDesc(User user);
}
