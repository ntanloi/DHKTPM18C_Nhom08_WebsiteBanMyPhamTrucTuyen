package iuh.fit.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record VerifyMailOtpRequest(@NotBlank String email, @NotBlank String code) {
}
