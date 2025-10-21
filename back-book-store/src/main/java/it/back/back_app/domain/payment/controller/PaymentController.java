package it.back.back_app.domain.payment.controller;

import it.back.back_app.domain.payment.dto.PaymentDTO;
import it.back.back_app.domain.payment.entity.Payment;
import it.back.back_app.domain.payment.service.PaymentService;
import it.back.back_app.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // 내 결제 내역 조회 
    @GetMapping
    public ResponseEntity<List<PaymentDTO>> getMyPayments(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(paymentService.getUserPayments(user.getUserId()));
    }

    // 결제 생성 (JSON Body로 금액 받기) 
    @PostMapping
    public ResponseEntity<PaymentDTO> createPayment(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody Map<String, Integer> body
    ) {
        Integer amount = body.get("amount");
        if (amount == null || amount <= 0) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(paymentService.createPayment(user.getUserId(), amount));
    }

    // 관리자: 전체 결제 내역 조회 
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentDTO>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    // 관리자: 결제 상태 변경 (JSON Body로 status 받기) 
    @PutMapping("/admin/{paymentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentDTO> updateStatus(
            @PathVariable Long paymentId,
            @RequestBody Map<String, String> body
    ) {
        String statusStr = body.get("status");
        if (statusStr == null) {
            return ResponseEntity.badRequest().build();
        }

        Payment.Status status = Payment.Status.valueOf(statusStr);
        return ResponseEntity.ok(paymentService.updateStatus(paymentId, status));
    }
}
