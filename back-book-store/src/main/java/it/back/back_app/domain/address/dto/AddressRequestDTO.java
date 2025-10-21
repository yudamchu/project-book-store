package it.back.back_app.domain.address.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressRequestDTO {
    private String receiverName;
    private String receiverPhone;
    private String address;
    private String addressDetail;
    private Boolean isDefault;
}
