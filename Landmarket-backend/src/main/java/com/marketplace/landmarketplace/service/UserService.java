package com.marketplace.landmarketplace.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.marketplace.landmarketplace.dto.LoginRequest;
import com.marketplace.landmarketplace.exception.BadRequestException;
import com.marketplace.landmarketplace.model.User;
import com.marketplace.landmarketplace.repository.UserRepository;
import com.marketplace.landmarketplace.security.JwtUtil;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public com.marketplace.landmarketplace.dto.LoginResponse login(LoginRequest request) {
        System.out.println("Login attempt for email: " + request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    System.out.println("User not found: " + request.getEmail());
                    return new BadRequestException("Invalid email or password");
                });

        if (Boolean.TRUE.equals(user.getAccountLocked())) {
            throw new BadRequestException("Account locked due to too many failed attempts");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            int attempts = user.getFailedAttempts() == null ? 0 : user.getFailedAttempts();
            attempts++;
            user.setFailedAttempts(attempts);

            if (attempts >= 5) {
                user.setAccountLocked(true);
            }
            userRepository.save(user);
            System.out.println("Invalid password for user: " + request.getEmail() + ". Attempts: " + attempts);
            throw new BadRequestException("Invalid email or password");
        }

        user.setFailedAttempts(0);
        userRepository.save(user);

        if (user.getRole() == null) {
            System.err.println("CRITICAL: User " + user.getEmail() + " has no role assigned!");
            throw new RuntimeException("User role is missing");
        }

        System.out.println("Login successful for: " + request.getEmail() + " with role: " + user.getRole());
        String token = jwtUtil.generateToken(user);
        return new com.marketplace.landmarketplace.dto.LoginResponse(token, user);
    }

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        System.out.println("============== PASSWORD RESET TOKEN ==============");
        System.out.println("Email: " + email);
        System.out.println("Token: " + token);
        System.out.println("==================================================");
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Invalid or expired reset token");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        user.setAccountLocked(false);
        user.setFailedAttempts(0);
        userRepository.save(user);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateProfile(String currentEmail, User profileData) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (profileData.getName() != null)
            user.setName(profileData.getName());

        // If email is changing, check if new email is already taken
        if (profileData.getEmail() != null && !profileData.getEmail().equals(user.getEmail())) {
            if (userRepository.findByEmail(profileData.getEmail()).isPresent()) {
                throw new BadRequestException("Email already in use");
            }
            user.setEmail(profileData.getEmail());
        }

        if (profileData.getAddress() != null)
            user.setAddress(profileData.getAddress());
        if (profileData.getPrimaryMobile() != null)
            user.setPrimaryMobile(profileData.getPrimaryMobile());
        if (profileData.getAdditionalMobile() != null)
            user.setAdditionalMobile(profileData.getAdditionalMobile());
        if (profileData.getAuthorityProof() != null)
            user.setAuthorityProof(profileData.getAuthorityProof());

        user.setProfileCompleted(true);
        return userRepository.save(user);
    }
}
