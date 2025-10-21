package it.back.back_app.domain.bookReview.service;

import it.back.back_app.domain.bookReview.dto.UserReviewRankingDTO;
import it.back.back_app.domain.bookReview.entity.BookReview;
import it.back.back_app.domain.bookReview.repository.BookReviewRepository;
import it.back.back_app.domain.books.entity.Book;
import it.back.back_app.domain.books.repository.BookRepository;
import it.back.back_app.domain.user.entity.User;
import it.back.back_app.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookReviewService {

    private final BookReviewRepository reviewRepo;
    private final BookRepository bookRepo;
 

    //리뷰 조회 (모두) 
    public List<BookReview> getReviews(Long bookId) {
        return reviewRepo.findByBookIdWithUser(bookId);
    }

    //특정 사용자의 리뷰 전체 조회 
    public List<BookReview> getReviewsByUser(Long userId) {
        return reviewRepo.findByUserIdWithBook(userId);
    }

    //리뷰 등록 (USER) 
    public void createReview(Long bookId, Byte rating, String comment, Authentication auth) {
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        User user = userDetails.getUser();
        Book book = bookRepo.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("도서를 찾을 수 없습니다."));

        BookReview review = BookReview.builder()
                .book(book)
                .user(user)
                .rating(rating)
                .comment(comment)
                .build();

        reviewRepo.save(review);
    }

    //리뷰 수정 (USER 본인 / ADMIN)
    //좋아요 수정 가능하도록 확장
    public void updateReview(Long reviewId, Byte rating, String comment, Integer likes, Authentication auth) {
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        BookReview review = reviewRepo.findById(reviewId)
            .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다."));

        if (!userDetails.getUser().getRole().equals(User.Role.ADMIN) &&
            !review.getUser().getUserId().equals(userDetails.getUser().getUserId())) {
        throw new SecurityException("수정 권한이 없습니다.");
        }

        review.setRating(rating);
        review.setComment(comment);

        if (likes != null) {          // 좋아요 값 전달 시에만 수정
            review.setLikes(likes);
        }

        reviewRepo.save(review);
    }

    //리뷰 삭제 (USER 본인 / ADMIN) 
    public void deleteReview(Long reviewId, Authentication auth) {
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        BookReview review = reviewRepo.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다."));

        if (!userDetails.getUser().getRole().equals(User.Role.ADMIN) &&
                !review.getUser().getUserId().equals(userDetails.getUser().getUserId())) {
            throw new SecurityException("삭제 권한이 없습니다.");
        }

        reviewRepo.delete(review);
    }

    //랭킹
    public List<UserReviewRankingDTO> getMonthlyTopReviewers() {
    List<Object[]> results = reviewRepo.findTopReviewersOfMonth();

    return results.stream()
            .map(obj -> new UserReviewRankingDTO(
                    ((Number) obj[0]).longValue(),     // userId
                    (String) obj[1],                   // username
                    ((Number) obj[2]).intValue()       // reviewCount
            ))
            .limit(10)
            .toList();
}

}
