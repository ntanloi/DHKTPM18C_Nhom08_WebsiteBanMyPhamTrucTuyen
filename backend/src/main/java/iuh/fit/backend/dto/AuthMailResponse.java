package iuh.fit.backend.dto;

// Deprecated: Use AuthResponse instead
// This file kept for backward compatibility
public record AuthMailResponse(String accessToken, String refreshToken, Integer userId, String email, String role) {
}
