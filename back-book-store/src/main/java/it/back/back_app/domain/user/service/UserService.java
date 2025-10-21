package it.back.back_app.domain.user.service;

import org.springframework.stereotype.Service;

import it.back.back_app.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // username 존재 여부 확인
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
}