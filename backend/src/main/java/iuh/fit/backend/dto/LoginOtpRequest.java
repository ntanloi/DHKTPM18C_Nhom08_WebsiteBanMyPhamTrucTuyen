package iuh.fit.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginOtpRequest(@NotBlank String phone) {
}
