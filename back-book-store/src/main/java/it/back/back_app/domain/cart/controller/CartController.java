package it.back.back_app.domain.cart.controller;

import it.back.back_app.domain.cart.dto.*;
import it.back.back_app.domain.cart.service.CartService;
import it.back.back_app.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/cart")
public class CartController {

    private final CartService cartService;

    //로그인한 사용자의 장바구니 조회 
    @GetMapping
    public ResponseEntity<CartResponseDTO> getCart(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(cartService.getCartByUser(user.getUserId()));
    }

    //장바구니 아이템 추가 
    @PostMapping("/items")
    public ResponseEntity<CartResponseDTO> addItem(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addItem(user.getUserId(), request.getBookId(), request.getQuantity()));
    }

    //장바구니 아이템 수정 
    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartItemDTO> updateItem(
            @PathVariable Long cartItemId,
            @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.updateItem(cartItemId, request.getQuantity()));
    }

    //장바구니 아이템 삭제 
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long cartItemId) {
        cartService.removeItem(cartItemId);
        return ResponseEntity.noContent().build();
    }

    //장바구니 비우기 
    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal CustomUserDetails user) {
        cartService.clearCart(user.getUserId());
        return ResponseEntity.noContent().build();
    }
}
