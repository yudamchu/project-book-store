package it.back.back_app.domain.cart.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItemRequest {
    private Long bookId;
    private int quantity;
}
