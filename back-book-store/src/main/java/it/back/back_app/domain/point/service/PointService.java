package it.back.back_app.domain.point.service;

import it.back.back_app.domain.point.dto.PointDTO;
import it.back.back_app.domain.point.entity.Point;
import it.back.back_app.domain.point.repository.PointRepository;
import it.back.back_app.domain.user.entity.User;
import it.back.back_app.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PointService {

    private final PointRepository pointRepository;
    private final UserRepository userRepository;

    // 특정 사용자 포인트 내역 조회 
    public List<PointDTO> getUserPoints(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return pointRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(PointDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 현재 잔액 조회 
    public Integer getCurrentBalance(User user) {
        return pointRepository.findTopByUserOrderByCreatedAtDesc(user)
                .map(Point::getBalance)
                .orElse(0);
    }

    // 포인트 증감 (충전/차감/환불/리뷰 공통 처리) 
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public PointDTO changePoint(Long userId, Point.ChangeType type, int amount) {
        User user = userRepository.findById(userId).orElseThrow();
        int currentBalance = getCurrentBalance(user);

        int delta;
        if (type == Point.ChangeType.결제차감) {
            delta = -Math.abs(amount);
        } else if (type == Point.ChangeType.환불 || type == Point.ChangeType.충전 || type == Point.ChangeType.리뷰) {
            delta = Math.abs(amount);
        } else {
            delta = amount;
        }

        int newBalance = currentBalance + delta;

        Point point = Point.builder()
                .user(user)
                .changeType(type)
                .points(delta)
                .balance(newBalance)
                .build();

        pointRepository.save(point);

        System.out.println("💰 포인트 변동 저장 완료: " + type + " / " + delta + " / 잔액 " + newBalance);

        return PointDTO.fromEntity(point);
    }

    // 관리자 전체 포인트 내역 조회 
    @PreAuthorize("hasRole('ADMIN')")
    public List<PointDTO> getAllPoints() {
        return pointRepository.findAll()
                .stream()
                .map(PointDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
