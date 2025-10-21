package it.back.back_app.domain.address.controller;

import it.back.back_app.domain.address.dto.*;
import it.back.back_app.domain.address.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    // 등록
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AddressResponseDTO> create(@RequestBody AddressRequestDTO dto) {
        return ResponseEntity.ok(addressService.createAddress(dto));
    }

    // 조회
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AddressResponseDTO>> list() {
        return ResponseEntity.ok(addressService.getAddresses());
    }

    // 수정
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AddressResponseDTO> update(@PathVariable Long id, @RequestBody AddressRequestDTO dto) {
        return ResponseEntity.ok(addressService.updateAddress(id, dto));
    }

    // 삭제
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }
}
