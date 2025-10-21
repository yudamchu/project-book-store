package it.back.back_app.domain.cart.repository;

import it.back.back_app.domain.cart.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // 특정 장바구니에 포함된 모든 아이템 조회
    List<CartItem> findByCart_CartId(Long cartId);

    // 특정 장바구니에 특정 도서가 이미 있는지 조회 (중복 방지 or 수량 증가용)
    Optional<CartItem> findByCart_CartIdAndBook_BookId(Long cartId, Long bookId);

}
