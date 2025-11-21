package iuh.fit.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record VerifyOtpRequest(@NotBlank String phone, @NotBlank String code) {
}
