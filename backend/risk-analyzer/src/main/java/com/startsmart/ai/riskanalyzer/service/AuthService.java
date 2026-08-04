package com.startsmart.ai.riskanalyzer.service;

import com.startsmart.ai.riskanalyzer.dto.AuthRequestDTO;
import com.startsmart.ai.riskanalyzer.dto.AuthResponseDTO;
import com.startsmart.ai.riskanalyzer.entity.User;
import com.startsmart.ai.riskanalyzer.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthResponseDTO signup(AuthRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        String hashedPassword = passwordEncoder.encode(dto.getPassword());

        User user = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(hashedPassword)
                .role("USER")
                .build();

        User saved = userRepository.save(user);

        return AuthResponseDTO.builder()
                .userId(saved.getUserId())
                .name(saved.getName())
                .email(saved.getEmail())
                .message("Account created successfully")
                .build();
    }

    public AuthResponseDTO login(AuthRequestDTO.Login dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("Invalid email or password"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return AuthResponseDTO.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .message("Login successful")
                .build();
    }
}
