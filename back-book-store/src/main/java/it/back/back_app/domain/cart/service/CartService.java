package it.back.back_app.domain.cart.service;

import it.back.back_app.domain.books.entity.Book;
import it.back.back_app.domain.books.repository.BookRepository;
import it.back.back_app.domain.cart.dto.*;
import it.back.back_app.domain.cart.entity.*;
import it.back.back_app.domain.cart.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;


    // 로그인한 사용자의 장바구니 조회 
    @Transactional(readOnly = true)
    public CartResponseDTO getCartByUser(Long userId) {
        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("장바구니를 찾을 수 없습니다."));

        List<CartItemDTO> items = cart.getItems().stream().map(item -> CartItemDTO.builder()
                .cartItemId(item.getCartItemId())
                .bookId(item.getBook().getBookId())
                .bookTitle(item.getBook().getTitle())
                .price(item.getBook().getPrice())
                .quantity(item.getQuantity())
                .stock(item.getBook().getStock())
                .build()
        ).collect(Collectors.toList());

        int total = items.stream().mapToInt(i -> i.getPrice() * i.getQuantity()).sum();

        return CartResponseDTO.builder()
                .cartId(cart.getCartId())
                .userId(cart.getUser().getUserId())
                .items(items)
                .totalPrice(total)
                .build();
    }

    //장바구니 아이템 추가 
    public CartResponseDTO addItem(Long userId, Long bookId, int quantity) {
    // 유저의 장바구니 가져오기 (없으면 예외)
    Cart cart = cartRepository.findByUser_UserId(userId)
            .orElseThrow(() -> new RuntimeException("장바구니 없음"));

    // 도서 조회 (없으면 예외)
    Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new RuntimeException("도서를 찾을 수 없습니다."));

    // 이미 장바구니에 해당 도서가 있는지 확인
    Optional<CartItem> existingItemOpt =
            cartItemRepository.findByCart_CartIdAndBook_BookId(cart.getCartId(), bookId);

    if (existingItemOpt.isPresent()) {
        // 이미 있으면 수량 누적
        CartItem existingItem = existingItemOpt.get();
        int newQuantity = existingItem.getQuantity() + quantity;
        existingItem.setQuantity(newQuantity);
        cartItemRepository.save(existingItem);
    } else {
        // 없으면 새로 추가
        CartItem newItem = CartItem.builder()
                .cart(cart)
                .book(book)
                .quantity(quantity)
                .build();
        cartItemRepository.save(newItem);
    }

    // 최종 장바구니 상태 반환
    return getCartByUser(userId);
}

    //장바구니 아이템 수정 (수량 변경) 
    public CartItemDTO updateItem(Long cartItemId, int quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("아이템을 찾을 수 없습니다."));

        item.setQuantity(quantity);
        return CartItemDTO.builder()
                .cartItemId(item.getCartItemId())
                .bookId(item.getBook().getBookId())
                .bookTitle(item.getBook().getTitle())
                .price(item.getBook().getPrice())
                .quantity(item.getQuantity())
                .build();
    }

    //장바구니 아이템 삭제 
    public void removeItem(Long cartItemId) {
        if (!cartItemRepository.existsById(cartItemId)) {
            throw new RuntimeException("아이템이 존재하지 않습니다.");
        }
        cartItemRepository.deleteById(cartItemId);
    }

    //장바구니 비우기 
    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("장바구니 없음"));
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
