package it.back.back_app.domain.bookImage.service;

import it.back.back_app.domain.bookImage.dto.BookImageResponseDTO;
import it.back.back_app.domain.bookImage.entity.BookImage;
import it.back.back_app.domain.bookImage.repository.BookImageRepository;
import it.back.back_app.domain.books.entity.Book;
import it.back.back_app.domain.books.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookImageService {

    private final BookImageRepository imageRepo;
    private final BookRepository bookRepo;

    @Value("${server.file.book.path}")
    private String uploadPath;


    // 전체 도서 이미지 조회 (관리자용)
    // 전체 도서 이미지 조회
    public List<BookImageResponseDTO> getAllImages() {
        List<BookImage> images = imageRepo.findAll();

        return images.stream()
        .<BookImageResponseDTO>map(img -> BookImageResponseDTO.builder()
                .imageId(img.getImageId())
                .bookId(img.getBook().getBookId())
                .imageUrl(img.getImageUrl())
                .sortOrder(img.getSortOrder().intValue())
                .uploadedAt(img.getUploadedAt() != null ? img.getUploadedAt().toString() : null)
                .build())
        .collect(Collectors.toList());
    }


    //조회 (모두 접근 가능) 
    public List<BookImageResponseDTO> getImages(Long bookId) {
        List<BookImage> images = imageRepo.findByBook_BookIdOrderBySortOrder(bookId);

        return images.stream()
                .map((BookImage img) -> BookImageResponseDTO.builder()
                        .imageId(img.getImageId())
                        .imageUrl(img.getImageUrl())
                        .sortOrder(img.getSortOrder().intValue()) 
                        .uploadedAt(img.getUploadedAt().toString())
                        .build() 
                )
                .collect(Collectors.toList());
    }


    //등록 (ADMIN) 
    public void uploadImages(Long bookId, List<MultipartFile> images, List<Integer> sortOrders) throws IOException {
        Book book = bookRepo.findById(bookId)
            .orElseThrow(() -> new IllegalArgumentException("도서를 찾을 수 없습니다."));

        // 업로드 폴더 자동 생성
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) uploadDir.mkdirs();

        for (int i = 0; i < images.size(); i++) {
            MultipartFile file = images.get(i);
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            String filePath = uploadPath + fileName;

        // 실제 파일 저장
        file.transferTo(new File(filePath));

        // sortOrder 지정 (없으면 0)
        int sortOrder = (sortOrders != null && sortOrders.size() > i) ? sortOrders.get(i) : 0;

        BookImage image = BookImage.builder()
                .book(book)
                .imageUrl("/files/book/" + fileName)
                .sortOrder((byte) sortOrder)
                .build();

        imageRepo.save(image);
        }
    }


    // 수정 (ADMIN): 정렬 순서 변경 
    public void updateSortOrder(Long imageId, int newOrder) {
        BookImage img = imageRepo.findById(imageId)
                .orElseThrow(() -> new IllegalArgumentException("이미지를 찾을 수 없습니다."));
        img.setSortOrder((byte) newOrder);
        imageRepo.save(img);
    }

    //삭제 (ADMIN) 
    public void deleteImage(Long imageId) {
        imageRepo.deleteById(imageId);
    }
}
