package iuh.fit.backend.dto;

public record AuthResponse(
    String accessToken,
    String refreshToken,
    Integer userId,
    String email,
    String role
) {
}
