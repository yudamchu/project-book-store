package it.back.back_app.domain.usedBookImage.controller;

import it.back.back_app.domain.usedBookImage.dto.UsedBookImageResponseDTO;
import it.back.back_app.domain.usedBookImage.service.UsedBookImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/used-book-images")
public class UsedBookImageController {

    private final UsedBookImageService usedBookImageService;

    //전체 조회용
    @GetMapping
    public ResponseEntity<List<UsedBookImageResponseDTO>> getAllImages() {
        List<UsedBookImageResponseDTO> imageList = usedBookImageService.getAllImages();
        return ResponseEntity.ok(imageList);
    }
    //중고 도서별 이미지 조회 (모두 접근 가능) 
    @GetMapping("/{usedBookId}")
    public ResponseEntity<List<UsedBookImageResponseDTO>> getImages(@PathVariable Long usedBookId) {
        return ResponseEntity.ok(usedBookImageService.getImages(usedBookId));
    }

    //이미지 업로드 (USER, ADMIN) 
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping(value = "/{usedBookId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadImages(
            @PathVariable Long usedBookId,
            @RequestPart("images") List<MultipartFile> images
    ) throws IOException {
        usedBookImageService.saveImages(usedBookId, images);
        return ResponseEntity.ok("중고 도서 이미지 업로드 성공");
    }

    //이미지 순서 변경 (대표 이미지 등) */
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PutMapping("/{imageId}")
    public ResponseEntity<String> updateSortOrder(
            @PathVariable Long imageId,
            @RequestParam int sortOrder
    ) {
        usedBookImageService.updateSortOrder(imageId, sortOrder);
        return ResponseEntity.ok("중고 도서 이미지 순서 변경 완료");
    }

    //이미지 삭제 
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long imageId) {
        usedBookImageService.deleteImage(imageId);
        return ResponseEntity.noContent().build();
    }
}
