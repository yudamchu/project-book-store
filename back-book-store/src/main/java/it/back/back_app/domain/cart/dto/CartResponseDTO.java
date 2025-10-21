package it.back.back_app.domain.cart.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponseDTO {
    private Long cartId;
    private Long userId;
    private int totalPrice;
    private List<CartItemDTO> items;
}
