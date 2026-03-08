package com.marketplace.landmarketplace.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marketplace.landmarketplace.dto.LoginRequest;
import com.marketplace.landmarketplace.model.User;
import com.marketplace.landmarketplace.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User saved = userService.registerUser(user);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<com.marketplace.landmarketplace.dto.LoginResponse> login(@RequestBody LoginRequest request) {
        com.marketplace.landmarketplace.dto.LoginResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody java.util.Map<String, String> request) {
        userService.forgotPassword(request.get("email"));
        return ResponseEntity.ok("If the email exists, a password reset token has been generated.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody java.util.Map<String, String> request) {
        userService.resetPassword(request.get("token"), request.get("newPassword"));
        return ResponseEntity.ok("Password has been successfully reset.");
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> opt = userService.getUserById(id);
        return opt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/update-profile")
    public ResponseEntity<User> updateProfile(@RequestBody User profileData, java.security.Principal principal) {
        User updated = userService.updateProfile(principal.getName(), profileData);
        return ResponseEntity.ok(updated);
    }
}
