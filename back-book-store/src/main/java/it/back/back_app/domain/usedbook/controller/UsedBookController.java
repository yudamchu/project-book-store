package it.back.back_app.domain.usedbook.controller;

import it.back.back_app.domain.usedbook.dto.*;
import it.back.back_app.domain.usedbook.service.UsedBookService;
import it.back.back_app.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/used-books")
public class UsedBookController {

    private final UsedBookService usedBookService;

    // 모두 접근 가능: 중고 도서 목록 조회 
    @GetMapping
    public ResponseEntity<?> list(
            @RequestParam(required = false) Long bookId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return ResponseEntity.ok(usedBookService.list(bookId, page, size));
    }

    // 모두 접근 가능: 상세 조회 
    @GetMapping("/{id}")
    public ResponseEntity<UsedBookResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(usedBookService.get(id));
    }

    // 로그인 사용자 (USER, ADMIN): 등록 + 이미지 업로드 
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UsedBookResponse> create(
            @RequestPart("data") UsedBookUpsertRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) throws IOException {
        UsedBookResponse response = usedBookService.createWithImages(request, images, userDetails.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 로그인 사용자 (USER, ADMIN): 수정 + 이미지 업로드 
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UsedBookResponse> update(
            @PathVariable Long id,
            @RequestPart("data") UsedBookUpsertRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) throws IOException {
        UsedBookResponse response = usedBookService.updateWithImages(id, request, images, userDetails);
        return ResponseEntity.ok(response);
    }

    // 로그인 사용자 (USER, ADMIN): 삭제 
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        usedBookService.delete(id, userDetails);
        return ResponseEntity.noContent().build();
    }
}
