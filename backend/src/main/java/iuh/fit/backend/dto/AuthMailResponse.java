package iuh.fit.backend.dto;

public record AuthMailResponse(String accessToken, String refreshToken, Integer userId, String email, String role) {
}
