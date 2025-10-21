package it.back.back_app.domain.order.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import it.back.back_app.domain.books.entity.Book;
import it.back.back_app.domain.usedbook.entity.UsedBook;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = true)
    private Book book;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "used_book_id", nullable = true)
    private UsedBook usedBook;

    private Integer quantity;
    private Integer price;
}
