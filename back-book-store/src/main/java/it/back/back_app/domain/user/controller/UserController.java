package it.back.back_app.domain.user.controller;

import it.back.back_app.domain.user.entity.User;
import it.back.back_app.domain.user.repository.UserRepository;
import it.back.back_app.domain.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserService userService;

    // 로그아웃 (JWT는 프론트에서 삭제)
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "로그아웃 완료!"));
    }

    // 회원가입 (FormData 기반)
    @PostMapping("/signup")
    public ResponseEntity<?> signup(HttpServletRequest request) {
        // FormData로 전달된 파라미터 읽기
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String name = request.getParameter("name");
        String phone = request.getParameter("phone");

        // 유효성 검사
        if (username == null || password == null || username.isEmpty() || password.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "아이디와 비밀번호는 필수입니다."));
        }

        // 중복 아이디 처리
        userRepository.findByUsername(username)
                .ifPresent(existing -> {
                    if (existing.getStatus() == User.Status.WITHDRAWN) {
                        userRepository.delete(existing);
                    } else {
                        throw new RuntimeException("이미 존재하는 사용자입니다.");
                    }
                });

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(password);

        // 새 유저 생성 및 저장
        User user = new User();
        user.setUsername(username);
        user.setPassword(encodedPassword);
        user.setName(name);
        user.setPhone(phone);
        user.setRole(User.Role.USER);
        user.setStatus(User.Status.ACTIVE);

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "회원가입 완료!"));
    }

    // 회원탈퇴 (Form 방식)
    @DeleteMapping("/users/{username}")
    public ResponseEntity<?> deleteUser(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        user.setStatus(User.Status.WITHDRAWN);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "회원탈퇴 완료!"));
    }

    // 내 정보 조회 (JWT 필요)
    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return ResponseEntity.ok(user);
    }

    //아이디 중복 체크
    @PostMapping("/check-username")
    public ResponseEntity<Map<String, Object>> checkUsername(@RequestParam String username) {

        boolean exists = userService.existsByUsername(username);

        Map<String, Object> response = new HashMap<>();
        response.put("exists", exists);
        response.put("message", exists ? "이미 사용 중인 아이디입니다." : "사용 가능한 아이디입니다.");

        return ResponseEntity.ok(response);
    }
}
