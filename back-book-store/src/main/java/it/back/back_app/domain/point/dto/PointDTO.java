package it.back.back_app.domain.point.dto;

import it.back.back_app.domain.point.entity.Point;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PointDTO {
    private Long pointId;
    private Long userId;
    private String username;
    private String changeType;
    private Integer points;
    private Integer balance;
    private LocalDateTime createdAt;

    public static PointDTO fromEntity(Point entity) {
        return PointDTO.builder()
                .pointId(entity.getPointId())
                .userId(entity.getUser().getUserId())
                .username(entity.getUser().getUsername())
                .changeType(entity.getChangeType().name())
                .points(entity.getPoints())
                .balance(entity.getBalance())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
