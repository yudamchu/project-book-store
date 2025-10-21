package it.back.back_app.domain.address.repository;

import it.back.back_app.domain.address.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {

    // 현재 로그인 사용자 id로 조회
    List<Address> findAllByUser_UserId(Long userId);

    // 특정 주소를 현재 로그인 사용자 범위로 조회
    Optional<Address> findByAddressIdAndUser_UserId(Long addressId, Long userId);

    // 현재 로그인 사용자 범위에서 삭제
    void deleteByAddressIdAndUser_UserId(Long addressId, Long userId);

    // 기본배송지 단독 설정 위해 사용
    List<Address> findByUser_UserIdAndIsDefaultTrue(Long userId);
}
