package it.back.back_app.domain.address.service;

import it.back.back_app.domain.address.dto.AddressRequestDTO;
import it.back.back_app.domain.address.dto.AddressResponseDTO;
import it.back.back_app.domain.address.entity.Address;
import it.back.back_app.domain.address.repository.AddressRepository;
import it.back.back_app.domain.user.entity.User;
import it.back.back_app.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다."));
    }

    private Long getCurrentUserId() {
        return getCurrentUser().getUserId();
    }

    @Transactional
    public AddressResponseDTO createAddress(AddressRequestDTO dto) {
        User user = getCurrentUser();
        Long uid = getCurrentUserId();

        Boolean wantDefault = dto.getIsDefault() != null ? dto.getIsDefault() : false;

        // 기본배송지 요청 시 기존 기본 해제
        if (wantDefault) {
            List<Address> currentDefaults = addressRepository.findByUser_UserIdAndIsDefaultTrue(uid);
            currentDefaults.forEach(a -> a.setIsDefault(false));
            addressRepository.saveAll(currentDefaults);
        }

        Address saved = addressRepository.save(
                Address.builder()
                        .user(user)
                        .receiverName(dto.getReceiverName())
                        .receiverPhone(dto.getReceiverPhone())
                        .address(dto.getAddress())
                        .addressDetail(dto.getAddressDetail())
                        .isDefault(wantDefault)
                        .build()
        );

        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<AddressResponseDTO> getAddresses() {
        Long uid = getCurrentUserId();
        return addressRepository.findAllByUser_UserId(uid).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressResponseDTO updateAddress(Long id, AddressRequestDTO dto) {
        Long uid = getCurrentUserId();

        Address address = addressRepository.findByAddressIdAndUser_UserId(id, uid)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "주소를 찾을 수 없습니다."));

        Boolean wantDefault = dto.getIsDefault() != null ? dto.getIsDefault() : address.getIsDefault();

        // 기본배송지 요청 시 기존 기본 해제
        if (wantDefault) {
            List<Address> currentDefaults = addressRepository.findByUser_UserIdAndIsDefaultTrue(uid);
            currentDefaults.forEach(a -> a.setIsDefault(false));
            addressRepository.saveAll(currentDefaults);
        }

        address.setReceiverName(dto.getReceiverName());
        address.setReceiverPhone(dto.getReceiverPhone());
        address.setAddress(dto.getAddress());
        address.setAddressDetail(dto.getAddressDetail());
        address.setIsDefault(wantDefault);

        return toDTO(addressRepository.save(address));
    }

    @Transactional
    public void deleteAddress(Long id) {
        Long uid = getCurrentUserId();

        // 삭제 전, 만약 기본배송지를 지우면 다음 주소 하나를 기본으로 승격 (선택 로직)
        Address target = addressRepository.findByAddressIdAndUser_UserId(id, uid)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "주소를 찾을 수 없습니다."));

        boolean wasDefault = Boolean.TRUE.equals(target.getIsDefault());

        // 실제 삭제 수행
        addressRepository.deleteByAddressIdAndUser_UserId(id, uid);

        // 만약 삭제된 주소가 기본배송지였다면 → 남은 주소 중 하나를 기본으로 지정
        if (wasDefault) {
            List<Address> remain = addressRepository.findAllByUser_UserId(uid);
            if (!remain.isEmpty()) {
                Address first = remain.get(0);
                first.setIsDefault(true);
                addressRepository.save(first);
            }   
        }
    }

    private AddressResponseDTO toDTO(Address a) {
        return AddressResponseDTO.builder()
                .addressId(a.getAddressId())
                .receiverName(a.getReceiverName())
                .receiverPhone(a.getReceiverPhone())
                .address(a.getAddress())
                .addressDetail(a.getAddressDetail())
                .isDefault(a.getIsDefault())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
