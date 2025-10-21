package it.back.back_app.domain.order.service;

import it.back.back_app.domain.address.entity.Address;
import it.back.back_app.domain.address.repository.AddressRepository;
import it.back.back_app.domain.books.entity.Book;
import it.back.back_app.domain.books.repository.BookRepository;
import it.back.back_app.domain.cart.entity.CartItem;
import it.back.back_app.domain.cart.repository.CartItemRepository;
import it.back.back_app.domain.order.dto.OrderDTO;
import it.back.back_app.domain.order.dto.OrderItemDTO;
import it.back.back_app.domain.order.entity.Order;
import it.back.back_app.domain.order.entity.OrderItem;
import it.back.back_app.domain.order.repository.OrderItemRepository;
import it.back.back_app.domain.order.repository.OrderRepository;
import it.back.back_app.domain.payment.entity.Payment;
import it.back.back_app.domain.payment.repository.PaymentRepository;
import it.back.back_app.domain.point.entity.Point;
import it.back.back_app.domain.point.service.PointService;
import it.back.back_app.domain.usedbook.entity.UsedBook;
import it.back.back_app.domain.usedbook.repository.UsedBookRepository;
import it.back.back_app.domain.user.entity.User;
import it.back.back_app.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final CartItemRepository cartItemRepository;
    private final AddressRepository addressRepository;
    private final BookRepository bookRepository;
    private final UsedBookRepository usedBookRepository; 
    private final PointService pointService;
    private final UserRepository userRepository;

    // 단일 주문 생성 (직접 구매용)
    public OrderDTO createOrder(Long userId, List<OrderItemDTO> items, Long addressId) {
        User user = userRepository.findById(userId).orElseThrow();
        Address address = addressRepository.findById(addressId).orElseThrow();

        int total = items.stream()
                .mapToInt(i -> i.getPrice() * i.getQuantity())
                .sum();

        // 재고/존재 검증
        for (OrderItemDTO dto : items) {
            if (dto.getBookId() != null) {
                Book book = bookRepository.findById(dto.getBookId())
                        .orElseThrow(() -> new RuntimeException("도서를 찾을 수 없습니다."));
                if (book.getStock() < dto.getQuantity()) {
                    throw new RuntimeException("[" + book.getTitle() + "]의 재고가 부족합니다.");
                }
            } else if (dto.getUsedBookId() != null) {
                usedBookRepository.findById(dto.getUsedBookId())
                        .orElseThrow(() -> new RuntimeException("중고 도서를 찾을 수 없습니다."));
            } else {
                throw new RuntimeException("bookId 또는 usedBookId가 필요합니다.");
            }
        }

        // 포인트 차감
        pointService.changePoint(userId, Point.ChangeType.결제차감, -total);

        // 결제 생성
        Payment payment = paymentRepository.save(Payment.builder()
                .user(user)
                .amount(total)
                .status(Payment.Status.성공)
                .build());

        // ✅ 주문 생성
        Order order = Order.builder()
                .user(user)
                .address(address)
                .status(Order.Status.결제완료)
                .totalPrice(total)
                .payment(payment)
                .build();

        // 주문 아이템 생성 (Book / UsedBook 구분)
        // 주문 아이템 생성 (Book / UsedBook 구분)
        List<OrderItem> orderItems = items.stream().map(dto -> {
        OrderItem.OrderItemBuilder builder = OrderItem.builder()
            .order(order)
            .quantity(dto.getQuantity())
            .price(dto.getPrice() * dto.getQuantity());

        if (dto.getBookId() != null) {
            Book book = bookRepository.findById(dto.getBookId())
                .orElseThrow(() -> new RuntimeException("도서를 찾을 수 없습니다."));
            book.decreaseStock(dto.getQuantity());
            builder.book(book);
        }

        if (dto.getUsedBookId() != null) {
        UsedBook usedBook = usedBookRepository.findById(dto.getUsedBookId())
            .orElseThrow(() -> new RuntimeException("중고 도서를 찾을 수 없습니다."));

        // 중고 도서의 원본 bookId 이용해서 Book 조회
        Book book = bookRepository.findById(usedBook.getBookId())
            .orElseThrow(() -> new RuntimeException("원본 도서를 찾을 수 없습니다."));

        builder.book(book);
        builder.usedBook(usedBook);

        usedBook.setStatus(UsedBook.Status.거래완료);
    }


            return builder.build();
    }).collect(Collectors.toList());

        order.setItems(orderItems);
        Order savedOrder = orderRepository.save(order);
        orderItemRepository.saveAll(orderItems);
        return OrderDTO.fromEntity(savedOrder);
    }

    // 장바구니 기반 주문 생성 (기존 로직 그대로)
    public OrderDTO createOrderFromCart(Long userId, Long cartId, Long addressId) {
        User user = userRepository.findById(userId).orElseThrow();
        Address address = addressRepository.findById(addressId).orElseThrow();

        List<CartItem> cartItems = cartItemRepository.findByCart_CartId(cartId);
        if (cartItems.isEmpty()) throw new RuntimeException("장바구니가 비어 있습니다.");

        for (CartItem ci : cartItems) {
            if (ci.getBook().getStock() < ci.getQuantity()) {
                throw new RuntimeException("[" + ci.getBook().getTitle() + "]의 재고가 부족합니다.");
            }
        }

        AtomicInteger total = new AtomicInteger(0);
        List<OrderItem> orderItems = cartItems.stream().map(ci -> {
            Book book = ci.getBook();
            int price = book.getPrice() * ci.getQuantity();
            total.addAndGet(price);
            book.decreaseStock(ci.getQuantity());

            return OrderItem.builder()
                    .book(book)
                    .quantity(ci.getQuantity())
                    .price(price)
                    .build();
        }).collect(Collectors.toList());

        // 포인트 차감 및 결제 생성
        pointService.changePoint(userId, Point.ChangeType.결제차감, -total.get());
        Payment payment = paymentRepository.save(Payment.builder()
                .user(user)
                .amount(total.get())
                .status(Payment.Status.성공)
                .build());

        // 주문 저장
        Order order = Order.builder()
                .user(user)
                .status(Order.Status.결제완료)
                .totalPrice(total.get())
                .payment(payment)
                .address(address)
                .build();

        orderItems.forEach(i -> i.setOrder(order));
        order.setItems(orderItems);
        Order savedOrder = orderRepository.save(order);

        // 장바구니 비우기
        cartItemRepository.deleteAll(cartItems);

        return OrderDTO.fromEntity(savedOrder);
    }

    // 사용자별 주문 조회
    public List<OrderDTO> getUserOrders(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return orderRepository.findByUser(user)
                .stream().map(OrderDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 관리자 전체 조회
    @PreAuthorize("hasRole('ADMIN')")
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll()
                .stream().map(OrderDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 관리자 상태 변경
    @PreAuthorize("hasRole('ADMIN')")
    public OrderDTO updateOrderStatus(Long orderId, Order.Status status) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        order.setStatus(status);
        return OrderDTO.fromEntity(orderRepository.save(order));
    }
}
