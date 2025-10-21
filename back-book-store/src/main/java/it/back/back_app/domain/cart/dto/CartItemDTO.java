package it.back.back_app.domain.cart.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    private Long cartItemId;
    private Long bookId;
    private String bookTitle;
    private Integer price;
    private int quantity;
    private int stock;
}
