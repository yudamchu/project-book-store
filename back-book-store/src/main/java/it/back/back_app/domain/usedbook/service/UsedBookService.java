package it.back.back_app.domain.usedbook.service;

import it.back.back_app.domain.books.entity.Book;
import it.back.back_app.domain.books.repository.BookRepository;
import it.back.back_app.domain.usedBookImage.service.UsedBookImageService;
import it.back.back_app.domain.usedbook.dto.*;
import it.back.back_app.domain.usedbook.entity.UsedBook;
import it.back.back_app.domain.usedbook.repository.UsedBookRepository;
import it.back.back_app.domain.user.entity.User;
import it.back.back_app.domain.user.repository.UserRepository;
import it.back.back_app.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UsedBookService {

    private final UsedBookRepository usedBookRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final UsedBookImageService usedBookImageService;

    // 목록 조회 
    public Page<UsedBookResponse> list(Long bookId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return usedBookRepository.search(bookId, pageable)
                .map(this::toResponse);
    }

    // 상세 조회 
    public UsedBookResponse get(Long id) {
        return toResponse(
                usedBookRepository.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("중고 도서를 찾을 수 없습니다."))
        );
    }

    //등록 + 이미지 업로드 
    @Transactional
    public UsedBookResponse createWithImages(UsedBookUpsertRequest req, List<MultipartFile> images, Long sellerId) throws IOException {
        if (req.getTitle() == null || req.getTitle().isBlank()) {
            throw new IllegalArgumentException("제목은 필수 입력 항목입니다.");
        }

        UsedBook usedBook = UsedBook.builder()
                .bookId(req.getBookId())
                .sellerId(sellerId)
                .title(req.getTitle())
                .price(req.getPrice())
                .condition(parseCondition(req.getCondition()))
                .status(parseStatus(req.getStatus()))
                .description(req.getDescription())
                .build();

        UsedBook saved = usedBookRepository.save(usedBook);

        // 이미지 업로드 함께 처리
        if (images != null && !images.isEmpty()) {
            usedBookImageService.saveImages(saved.getUsedBookId(), images);
        }

        return toResponse(saved);
    }

    //수정 + 이미지 업로드 
    @Transactional
    public UsedBookResponse updateWithImages(Long id, UsedBookUpsertRequest req, List<MultipartFile> images, CustomUserDetails userDetails) throws IOException {
        UsedBook usedBook = usedBookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("중고 도서를 찾을 수 없습니다."));

        Long loginUserId = userDetails.getUserId();
        boolean isOwner = usedBook.getSellerId().equals(loginUserId);
        boolean isAdmin = userDetails.getUser().getRole() == User.Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new SecurityException("본인이 등록한 글만 수정할 수 있습니다.");
        }

        usedBook.setTitle(req.getTitle());
        usedBook.setPrice(req.getPrice());
        usedBook.setCondition(parseCondition(req.getCondition()));
        usedBook.setStatus(parseStatus(req.getStatus()));
        usedBook.setDescription(req.getDescription());

        usedBookRepository.save(usedBook);

        if (images != null && !images.isEmpty()) {
            usedBookImageService.saveImages(usedBook.getUsedBookId(), images);
        }

        return toResponse(usedBook);
    }

    // 삭제 
    @Transactional
    public void delete(Long id, CustomUserDetails userDetails) {
        UsedBook usedBook = usedBookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("중고 도서를 찾을 수 없습니다."));

        Long loginUserId = userDetails.getUserId();
        boolean isOwner = usedBook.getSellerId().equals(loginUserId);
        boolean isAdmin = userDetails.getUser().getRole() == User.Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new SecurityException("본인이 등록한 글만 삭제할 수 있습니다.");
        }

        usedBookRepository.delete(usedBook);
    }

    private UsedBook.Condition parseCondition(String condition) {
        try {
            return UsedBook.Condition.valueOf(condition);
        } catch (Exception e) {
            return UsedBook.Condition.중;
        }
    }

    private UsedBook.Status parseStatus(String status) {
        try {
            return UsedBook.Status.valueOf(status);
        } catch (Exception e) {
            return UsedBook.Status.판매중;
        }
    }

  
    private UsedBookResponse toResponse(UsedBook u) {
        String sellerName = userRepository.findById(u.getSellerId())
                .map(User::getUsername)
                .orElse("탈퇴회원");

        Integer originalPrice = bookRepository.findById(u.getBookId())
                .map(Book::getPrice)
                .orElse(null);

        return UsedBookResponse.builder()
                .usedBookId(u.getUsedBookId())
                .bookId(u.getBookId())
                .sellerId(u.getSellerId())
                .sellerName(sellerName)
                .title(u.getTitle())
                .price(u.getPrice())
                .originalPrice(originalPrice)
                .condition(u.getCondition().name())
                .status(u.getStatus().name())
                .description(u.getDescription())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
