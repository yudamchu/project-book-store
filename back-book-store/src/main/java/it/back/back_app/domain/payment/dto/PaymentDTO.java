package it.back.back_app.domain.payment.dto;

import it.back.back_app.domain.payment.entity.Payment;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Long paymentId;
    private Long userId;
    private String username;
    private Integer amount;
    private String status;
    private LocalDateTime paymentDate;

    public static PaymentDTO fromEntity(Payment entity) {
        return PaymentDTO.builder()
                .paymentId(entity.getPaymentId())
                .userId(entity.getUser().getUserId())
                .username(entity.getUser().getUsername())
                .amount(entity.getAmount())
                .status(entity.getStatus().name())
                .paymentDate(entity.getPaymentDate())
                .build();
    }
}
