package it.back.back_app.domain.address.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddressResponseDTO {
    private Long addressId;
    private String receiverName;
    private String receiverPhone;
    private String address;
    private String addressDetail;
    private Boolean isDefault;
    private LocalDateTime createdAt;
}
