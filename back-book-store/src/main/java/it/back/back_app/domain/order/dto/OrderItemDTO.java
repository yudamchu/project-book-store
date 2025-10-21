package it.back.back_app.domain.order.dto;

import it.back.back_app.domain.order.entity.OrderItem;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {

    private Long orderItemId;
    private Long bookId;
    private String bookTitle;
    private Integer quantity;
    private Integer price;
    private Long usedBookId;

    public static OrderItemDTO fromEntity(OrderItem entity) {
        return OrderItemDTO.builder()
                .orderItemId(entity.getOrderItemId())
                .bookId(entity.getBook() != null ? entity.getBook().getBookId() : null)
                .usedBookId(entity.getUsedBook() != null ? entity.getUsedBook().getUsedBookId() : null)
                .bookTitle(
                        entity.getBook() != null
                                ? entity.getBook().getTitle()
                                : entity.getUsedBook() != null
                                    ? entity.getUsedBook().getTitle()
                                    : null
                )
                .quantity(entity.getQuantity())
                .price(entity.getPrice())
                .build();
    }
}
