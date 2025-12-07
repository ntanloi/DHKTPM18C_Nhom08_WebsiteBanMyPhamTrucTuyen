package iuh.fit.backend.service;

import iuh.fit.backend.dto.AuthResponse;
import iuh.fit.backend.dto.LoginMailOtpRequest;
import iuh.fit.backend.dto.LoginRequest;
import iuh.fit.backend.dto.RegisterRequest;
import iuh.fit.backend.dto.VerifyMailOtpRequest;
import iuh.fit.backend.model.Role;
import iuh.fit.backend.model.User;
import iuh.fit.backend.repository.RoleRepository;
import iuh.fit.backend.repository.UserRepository;
import iuh.fit.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final OtpService otpService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    // Register new user with email & password
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check email exists
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already exists");
        }

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Default role USER not found"));

        // Create user with encrypted password
        User newUser = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .isActive(true)
                .emailVerifiedAt(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        newUser.setRole(userRole);
        User savedUser = userRepository.save(newUser);

        // Generate JWT tokens
        String accessToken = jwtUtil.generateAccessToken(
            savedUser.getEmail(),
            savedUser.getId().longValue(),
            savedUser.getRole().getName()
        );
        String refreshToken = jwtUtil.generateRefreshToken(savedUser.getEmail());

        log.info("User registered: {}", savedUser.getEmail());

        return new AuthResponse(
            accessToken,
            refreshToken,
            savedUser.getId(),
            savedUser.getEmail(),
            savedUser.getRole().getName()
        );
    }

    // Login with email & password
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Check if account has password (OTP-only accounts don't have password)
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new RuntimeException("This account uses OTP login only");
        }

        // Verify password
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.getIsActive()) {
            throw new RuntimeException("Account is inactive");
        }

        // Generate JWT tokens
        String accessToken = jwtUtil.generateAccessToken(
            user.getEmail(),
            user.getId().longValue(),
            user.getRole().getName()
        );
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        log.info("User logged in with password: {}", user.getEmail());

        return new AuthResponse(
            accessToken,
            refreshToken,
            user.getId(),
            user.getEmail(),
            user.getRole().getName()
        );
    }

    // Send OTP to email for passwordless login
    public void sendOtp(LoginMailOtpRequest request) {
        String email = request.email();
        log.info("Sending OTP to email: {}", email);
        otpService.sendOtp(email, "LOGIN");
    }

    // Verify OTP and login (auto-create user if not exists)
    @Transactional
    public AuthResponse verifyOtpAndLogin(VerifyMailOtpRequest request) {
        String email = request.email();
        String code = request.code();

        // Verify OTP code
        otpService.verifyOtp(email, code, "LOGIN");

        // Find or create user
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createNewUser(email));

        // Generate JWT tokens
        String accessToken = jwtUtil.generateAccessToken(
            email,
            user.getId().longValue(),
            user.getRole().getName()
        );
        String refreshToken = jwtUtil.generateRefreshToken(email);

        log.info("User logged in: {}", email);

        return new AuthResponse(
            accessToken,
            refreshToken,
            user.getId(),
            user.getEmail(),
            user.getRole().getName()
        );
    }

    // Create new user without password (for OTP login)
    private User createNewUser(String email) {
        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Default role USER not found"));

        User newUser = User.builder()
                .email(email)
                .password(null) // No password for OTP-only accounts
                .fullName(email.split("@")[0])
                .isActive(true)
                .emailVerifiedAt(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        newUser.setRole(userRole);

        User savedUser = userRepository.save(newUser);
        log.info("Created new user with OTP: {}", email);
        
        return savedUser;
    }

    // Refresh access token using refresh token
    public AuthResponse refreshToken(String refreshToken) {
        try {
            if (!jwtUtil.isRefreshToken(refreshToken)) throw new RuntimeException("Invalid token");

            // Extract email from refresh token
            String email = jwtUtil.extractUsername(refreshToken);

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Generate new tokens
            String newAccessToken = jwtUtil.generateAccessToken(
                email,
                user.getId().longValue(),
                user.getRole().getName()
            );
            String newRefreshToken = jwtUtil.generateRefreshToken(email);

            return new AuthResponse(
                newAccessToken,
                newRefreshToken,
                user.getId(),
                user.getEmail(),
                user.getRole().getName()
            );
        } catch (Exception e) {
            log.error("Error refreshing token: {}", e.getMessage());
            throw new RuntimeException("Invalid refresh token");
        }
    }

    // Verify current user - returns actual user info from database
    // This ensures role is fetched from database, not trusted from JWT claims alone
    public AuthResponse verifyCurrentUser() {
        // Get current authenticated user from SecurityContext
        org.springframework.security.core.Authentication authentication = 
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user");
        }

        String email = authentication.getName();
        
        // Fetch fresh user data from database
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getIsActive()) {
            throw new RuntimeException("Account is inactive");
        }

        // Return user info with ACTUAL role from database
        return new AuthResponse(
            null,  // No new token needed
            null,  // No new refresh token needed
            user.getId(),
            user.getEmail(),
            user.getRole().getName()  // This is the DATABASE role, not JWT claim
        );
    }
}
