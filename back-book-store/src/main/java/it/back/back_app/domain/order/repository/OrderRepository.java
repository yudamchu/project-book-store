package it.back.back_app.domain.order.repository;

import it.back.back_app.domain.order.entity.Order;
import it.back.back_app.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
}
