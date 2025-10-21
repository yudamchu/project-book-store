package it.back.back_app.domain.user.repository;

import it.back.back_app.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // 기존 로그인용
    Optional<User> findByUsername(String username);

    // 아이디 중복확인용 (JPA가 자동으로 쿼리 생성)
    boolean existsByUsername(String username);
}

