package it.back.back_app.domain.bookImage.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookImageResponseDTO {
    private Long imageId;
    private Long bookId;   
    private String imageUrl;
    private Integer sortOrder;
    private String uploadedAt;
}
