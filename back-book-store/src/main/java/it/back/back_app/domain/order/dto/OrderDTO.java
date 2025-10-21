package it.back.back_app.domain.order.dto;

import it.back.back_app.domain.order.entity.Order;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long orderId;
    private String username;
    private Integer totalPrice;
    private String status;
    private LocalDateTime orderDate;
    private Long paymentId;
    private String receiverName;
    private String receiverPhone;
    private String address;
    private String addressDetail;
    private List<OrderItemDTO> items;

    public static OrderDTO fromEntity(Order entity) {
        return OrderDTO.builder()
                .orderId(entity.getOrderId())
                .username(entity.getUser().getUsername())
                .totalPrice(entity.getTotalPrice())
                .status(entity.getStatus().name())
                .orderDate(entity.getOrderDate())
                .paymentId(
                        entity.getPayment() != null
                                ? entity.getPayment().getPaymentId()
                                : null
                )
                .receiverName(entity.getAddress() != null ? entity.getAddress().getReceiverName() : null)
                .receiverPhone(entity.getAddress() != null ? entity.getAddress().getReceiverPhone() : null)
                .address(entity.getAddress() != null ? entity.getAddress().getAddress() : null)
                .addressDetail(entity.getAddress() != null ? entity.getAddress().getAddressDetail() : null)
                .items(entity.getItems().stream()
                        .map(OrderItemDTO::fromEntity)
                        .collect(Collectors.toList()))
                .build();
    }
}
