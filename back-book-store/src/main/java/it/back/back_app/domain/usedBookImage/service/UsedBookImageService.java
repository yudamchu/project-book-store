package it.back.back_app.domain.usedBookImage.service;

import it.back.back_app.domain.usedBookImage.dto.UsedBookImageResponseDTO;
import it.back.back_app.domain.usedBookImage.entity.UsedBookImage;
import it.back.back_app.domain.usedBookImage.repository.UsedBookImageRepository;
import it.back.back_app.domain.usedbook.entity.UsedBook;
import it.back.back_app.domain.usedbook.repository.UsedBookRepository;
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
public class UsedBookImageService {

    private final UsedBookImageRepository imageRepo;
    private final UsedBookRepository usedBookRepo;

    @Value("${server.file.usedbook.path}")
    private String uploadPath;

    //여러 이미지 저장 
    public void saveImages(Long usedBookId, List<MultipartFile> images) throws IOException {
        UsedBook usedBook = usedBookRepo.findById(usedBookId)
                .orElseThrow(() -> new IllegalArgumentException("중고 도서를 찾을 수 없습니다."));

        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) uploadDir.mkdirs();

        for (MultipartFile file : images) {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            String filePath = uploadPath + fileName;

            file.transferTo(new File(filePath));

            UsedBookImage image = UsedBookImage.builder()
                    .usedBook(usedBook)
                    .imageUrl("/files/usedbook/" + fileName)
                    .sortOrder((byte) 0)
                    .build();

            imageRepo.save(image);
        }
    }

    public List<UsedBookImageResponseDTO> getAllImages() {
    List<UsedBookImage> entities = imageRepo.findAll();

    return entities.stream()
            .map(UsedBookImageResponseDTO::fromEntity)
            .toList();
    }

    // 조회 
    public List<UsedBookImageResponseDTO> getImages(Long usedBookId) {
        List<UsedBookImage> images = imageRepo.findByUsedBook_UsedBookIdOrderBySortOrder(usedBookId);
        return images.stream()
                .map(img -> UsedBookImageResponseDTO.builder()
                        .imageId(img.getImageId())
                        .usedBookId(img.getUsedBook().getUsedBookId())
                        .imageUrl(img.getImageUrl())
                        .sortOrder(img.getSortOrder().intValue())
                        .uploadedAt(img.getUploadedAt().toString())
                        .build())
                .collect(Collectors.toList());
    }

    //순서 변경 
    public void updateSortOrder(Long imageId, int newOrder) {
        UsedBookImage img = imageRepo.findById(imageId)
                .orElseThrow(() -> new IllegalArgumentException("이미지를 찾을 수 없습니다."));
        img.setSortOrder((byte) newOrder);
        imageRepo.save(img);
    }

    // 삭제 
    public void deleteImage(Long imageId) {
        imageRepo.deleteById(imageId);
    }
}

