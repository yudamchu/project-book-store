package it.back.back_app.domain.usedBookImage.dto;

import it.back.back_app.domain.usedBookImage.entity.UsedBookImage;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsedBookImageResponseDTO {
    private Long imageId;
    private Long usedBookId;
    private String imageUrl;
    private Integer sortOrder;
    private String uploadedAt;

    // 엔티티 → DTO 변환용 정적 메서드
    public static UsedBookImageResponseDTO fromEntity(UsedBookImage entity) {
        return UsedBookImageResponseDTO.builder()
                .imageId(entity.getImageId())
                .usedBookId(entity.getUsedBook().getUsedBookId()) // 연관관계일 경우
                .imageUrl(entity.getImageUrl())
                .sortOrder(entity.getSortOrder().intValue())
                .build();
    }
}

