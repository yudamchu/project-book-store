package it.back.back_app.domain.payment.repository;

import it.back.back_app.domain.payment.entity.Payment;
import it.back.back_app.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUser(User user);
}
