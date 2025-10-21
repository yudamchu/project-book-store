package it.back.back_app.domain.order.controller;

import it.back.back_app.domain.order.dto.OrderDTO;
import it.back.back_app.domain.order.dto.OrderItemDTO;
import it.back.back_app.domain.order.entity.Order;
import it.back.back_app.domain.order.service.OrderService;
import it.back.back_app.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    //단일 주문 생성 
    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(
        @AuthenticationPrincipal CustomUserDetails user,
        @RequestBody Object bodyObj
    ) {
        Map<String, Object> body = (Map<String, Object>) bodyObj;

        Object addrObj = body.get("addressId");
        Long addressId = null;
        
        if (addrObj instanceof Number) {
            addressId = ((Number) addrObj).longValue();
        } else if (addrObj instanceof List<?> list && !list.isEmpty()) {
            addressId = ((Number) list.get(0)).longValue();
        } else {
            throw new IllegalArgumentException("addressId가 올바르지 않습니다.");
        }

    List<Map<String, Object>> itemsMap = (List<Map<String, Object>>) body.get("items");

    List<OrderItemDTO> items = itemsMap.stream()
            .map(m -> {
                OrderItemDTO.OrderItemDTOBuilder builder = OrderItemDTO.builder()
                        .quantity(((Number) m.get("quantity")).intValue())
                        .price(((Number) m.get("price")).intValue());

                if (m.get("bookId") != null) {
                    builder.bookId(((Number) m.get("bookId")).longValue());
                }
                if (m.get("usedBookId") != null) {
                    builder.usedBookId(((Number) m.get("usedBookId")).longValue());
                }

                return builder.build();
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(orderService.createOrder(user.getUserId(), items, addressId));
    }


    //장바구니 기반 주문 생성 
    @PostMapping("/from-cart")
    public ResponseEntity<OrderDTO> createFromCart(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody Map<String, Long> body
    ) {
        Long cartId = body.get("cartId");
        Long addressId = body.get("addressId");
        return ResponseEntity.ok(orderService.createOrderFromCart(user.getUserId(), cartId, addressId));
    }

    //내 주문 내역 조회 
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getMyOrders(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(orderService.getUserOrders(user.getUserId()));
    }

    //관리자 전체 주문 조회 
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    //관리자 주문 상태 변경 
    @PutMapping("/admin/{orderId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDTO> updateStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> body
    ) {
        String statusStr = body.get("status");
        if (statusStr == null) return ResponseEntity.badRequest().build();
        Order.Status status = Order.Status.valueOf(statusStr);
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }
}
