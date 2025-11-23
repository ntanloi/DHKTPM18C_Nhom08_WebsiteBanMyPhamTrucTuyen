package iuh.fit.backend.controller;

import iuh.fit.backend.dto.AuthResponse;
import iuh.fit.backend.dto.LoginMailOtpRequest;
import iuh.fit.backend.dto.LoginRequest;
import iuh.fit.backend.dto.RegisterRequest;
import iuh.fit.backend.dto.VerifyMailOtpRequest;
import iuh.fit.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final AuthService authService;

    // Register with email & password
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Error registering user: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "Registration failed");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // Login with email & password
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error logging in: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "Login failed");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    // Send OTP to email (passwordless login)
    // Send OTP to email (passwordless login)
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@Valid @RequestBody LoginMailOtpRequest request) {
        try {
            authService.sendOtp(request);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "OTP sent to email");
            response.put("email", request.email());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error sending OTP: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to send OTP");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // Verify OTP and login
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody VerifyMailOtpRequest request) {
        try {
            AuthResponse response = authService.verifyOtpAndLogin(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error verifying OTP: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid OTP");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    // Refresh JWT tokens
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        try {
            String refreshToken = request.get("refreshToken");
            if (refreshToken == null || refreshToken.isBlank()) {
                throw new RuntimeException("Refresh token is required");
            }
            
            AuthResponse response = authService.refreshToken(refreshToken);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error refreshing token: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "Token refresh failed");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    // Logout (client-side clears tokens)
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logout successful");
        return ResponseEntity.ok(response);
    }
}
