package it.back.back_app.domain.member.service;

import it.back.back_app.domain.member.dto.*;
import it.back.back_app.domain.user.repository.UserRepository;
import it.back.back_app.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 전체 회원 조회 (관리자 전용)
    public List<User> findAll() {
        return userRepository.findAll();
    }

    // 단일 회원 조회
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));
    }

    // 일반 회원 수정 (본인 or 관리자)
    public void updateMember(Long id, MemberUpdateRequest dto, Authentication auth) {
        User user = findById(id);
        String loginUsername = auth.getName();

        // 본인 또는 관리자만 가능
        if (!loginUsername.equals(user.getUsername()) &&
            auth.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new AccessDeniedException("권한이 없습니다.");
        }

        if (dto.getUsername() != null) user.setUsername(dto.getUsername());
        if (dto.getPassword() != null) user.setPassword(passwordEncoder.encode(dto.getPassword()));
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());

        userRepository.save(user);
    }

    // 관리자 전체 수정 (모든 필드 변경 가능)
    public void adminFullUpdate(Long id, AdminMemberUpdateRequest dto) {
        User user = findById(id);

        if (dto.getUsername() != null) user.setUsername(dto.getUsername());
        if (dto.getPassword() != null) user.setPassword(passwordEncoder.encode(dto.getPassword()));
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getRole() != null) user.setRole(dto.getRole());
        if (dto.getStatus() != null) user.setStatus(dto.getStatus());

        userRepository.save(user);
    }

    // 관리자 회원 삭제 (권한 확인 없이 바로)
    public void deleteUserByAdmin(Long id) {
        userRepository.deleteById(id);
    }

    // 기존 deleteMember (본인 삭제용)
    public void deleteMember(Long id, Authentication auth) {
        User user = findById(id);
        String loginUsername = auth.getName();

        if (!loginUsername.equals(user.getUsername()) &&
            auth.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new AccessDeniedException("권한이 없습니다.");
        }

        userRepository.delete(user);
    }
}
