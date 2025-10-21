package it.back.back_app.domain.bookImage.controller;

import it.back.back_app.domain.bookImage.dto.BookImageResponseDTO;
import it.back.back_app.domain.bookImage.service.BookImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/book-images")
public class BookImageController {

    private final BookImageService bookImageService;

    // 전체 이미지 조회
    @GetMapping
    public ResponseEntity<List<BookImageResponseDTO>> getAllImages() {
        List<BookImageResponseDTO> images = bookImageService.getAllImages();
        return ResponseEntity.ok(images);
    }

    //이미지 조회 (모두) 
    @GetMapping("/{bookId}")
    public ResponseEntity<List<BookImageResponseDTO>> getImages(@PathVariable Long bookId) {
        List<BookImageResponseDTO> imageList = bookImageService.getImages(bookId);
        return ResponseEntity.ok(imageList);
    }


    //이미지 업로드 (ADMIN) 
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "/{bookId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadImages(
        @PathVariable Long bookId,
        @RequestParam("images") List<MultipartFile> images,
        @RequestParam(value = "sortOrders", required = false) List<Integer> sortOrders
    ) throws IOException {
        bookImageService.uploadImages(bookId, images, sortOrders);
        return ResponseEntity.ok("이미지 업로드 성공");
    }


    // 정렬 순서 변경 (ADMIN) 
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{imageId}")
    public ResponseEntity<String> updateSortOrder(
            @PathVariable Long imageId,
            @RequestParam int sortOrder
    ) {
        bookImageService.updateSortOrder(imageId, sortOrder);
        return ResponseEntity.ok("이미지 순서 변경 완료");
    }

    // 이미지 삭제 (ADMIN) 
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long imageId) {
        bookImageService.deleteImage(imageId);
        return ResponseEntity.noContent().build();
    }
}
