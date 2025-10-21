package it.back.back_app.domain.point.controller;

import it.back.back_app.domain.point.dto.PointDTO;
import it.back.back_app.domain.point.entity.Point;
import it.back.back_app.domain.point.service.PointService;
import it.back.back_app.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/points")
@RequiredArgsConstructor
public class PointController {

    private final PointService pointService;

    // 내 포인트 내역 조회 
    @GetMapping("/me")
    public ResponseEntity<List<PointDTO>> getMyPoints(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(pointService.getUserPoints(user.getUserId()));
    }

    // 관리자: 전체 포인트 내역 조회 
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PointDTO>> getAllPoints() {
        return ResponseEntity.ok(pointService.getAllPoints());
    }

    // 일반 사용자: 포인트 충전 
    @PostMapping("/charge")
    public ResponseEntity<PointDTO> chargePoint(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody Map<String, Integer> body) {

        Integer amount = body.get("amount");
        if (amount == null || amount <= 0) {
            return ResponseEntity.badRequest().build();
        }

        PointDTO result = pointService.changePoint(user.getUserId(), Point.ChangeType.충전, amount);
        return ResponseEntity.ok(result);
    }

    // 관리자: 특정 사용자 포인트 조정 
    @PostMapping("/admin/change/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PointDTO> adminChangePoint(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> body) {

        Integer amount = (Integer) body.get("amount");
        String typeStr = (String) body.get("type");

        if (amount == null || typeStr == null) {
            return ResponseEntity.badRequest().build();
        }

        //영어/한글 타입 모두 지원
        Point.ChangeType type = switch (typeStr.toUpperCase()) {
            case "ADD", "CHARGE", "충전" -> Point.ChangeType.충전;
            case "SUB", "DEDUCT", "차감", "결제차감" -> Point.ChangeType.결제차감;
            case "REFUND", "환불" -> Point.ChangeType.환불;
            case "REVIEW", "리뷰" -> Point.ChangeType.리뷰;
            default -> throw new IllegalArgumentException("Invalid type: " + typeStr);
        };

        PointDTO result = pointService.changePoint(userId, type, amount);
        return ResponseEntity.ok(result);
    }
}
