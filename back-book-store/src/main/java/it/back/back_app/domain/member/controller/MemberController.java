package it.back.back_app.domain.member.controller;

import it.back.back_app.domain.member.dto.AdminMemberUpdateRequest;
import it.back.back_app.domain.member.dto.MemberUpdateRequest;
import it.back.back_app.domain.member.service.MemberService;
import it.back.back_app.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/member")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;


    // 단일 조회 (일반/관리자)
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<User> getById(@PathVariable Long id) {
        return ResponseEntity.ok(memberService.findById(id));
    }

    // 일반 회원 수정 (username, password, name, phone)
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<String> updateUser(
            @PathVariable Long id,
            @RequestBody MemberUpdateRequest dto,
            Authentication auth
    ) {
        memberService.updateMember(id, dto, auth);
        return ResponseEntity.ok("회원 정보가 수정되었습니다.");
    }

    // 전체 조회 (관리자 전용)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAll() {
        return ResponseEntity.ok(memberService.findAll());
    }

    // 관리자 수정 (모든 필드: username, password, name, phone, role, status)
    @PutMapping("/{id}/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> adminUpdate(
            @PathVariable Long id,
            @RequestBody AdminMemberUpdateRequest dto
    ) {
        memberService.adminFullUpdate(id, dto);
        return ResponseEntity.ok("관리자가 회원 정보를 수정했습니다.");
    }

    // 관리자 삭제
    @DeleteMapping("/{id}/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        memberService.deleteUserByAdmin(id);
        return ResponseEntity.ok("관리자가 회원을 삭제했습니다.");
    }
}
