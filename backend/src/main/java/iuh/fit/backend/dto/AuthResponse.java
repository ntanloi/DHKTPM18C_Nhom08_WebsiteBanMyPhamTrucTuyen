package iuh.fit.backend.dto;

public record AuthResponse(String token, Integer userId, String phone) {
}
