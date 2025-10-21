package it.back.back_app.domain.payment.service;

import it.back.back_app.domain.payment.dto.PaymentDTO;
import it.back.back_app.domain.payment.entity.Payment;
import it.back.back_app.domain.payment.repository.PaymentRepository;
import it.back.back_app.domain.point.entity.Point;
import it.back.back_app.domain.point.service.PointService;
import it.back.back_app.domain.user.entity.User;
import it.back.back_app.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PointService pointService;
    private final UserRepository userRepository;

    public PaymentDTO createPayment(Long userId, Integer amount) {
        User user = userRepository.findById(userId).orElseThrow();
        Integer balance = pointService.getCurrentBalance(user);
        if (balance < amount) throw new RuntimeException("잔액 부족");

        // 포인트 차감
        pointService.changePoint(userId, Point.ChangeType.결제차감, -amount);

        Payment payment = paymentRepository.save(Payment.builder()
                .user(user)
                .amount(amount)
                .status(Payment.Status.성공)
                .build());

        return PaymentDTO.fromEntity(payment);
    }

    public List<PaymentDTO> getUserPayments(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return paymentRepository.findByUser(user).stream()
                .map(PaymentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<PaymentDTO> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(PaymentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public PaymentDTO updateStatus(Long paymentId, Payment.Status status) {
        Payment payment = paymentRepository.findById(paymentId).orElseThrow();
        payment.setStatus(status);

        // 결제 취소 시 포인트 환불
        if (status == Payment.Status.취소) {
            pointService.changePoint(payment.getUser().getUserId(), Point.ChangeType.환불, payment.getAmount());
        }

        return PaymentDTO.fromEntity(paymentRepository.save(payment));
    }
}
