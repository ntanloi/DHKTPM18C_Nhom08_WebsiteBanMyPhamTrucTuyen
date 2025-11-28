package iuh.fit.backend.repository;

import iuh.fit.backend.model.OtpCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpCodeRepository extends JpaRepository<OtpCode, Integer> {
    Optional<OtpCode> findByPhoneAndPurposeAndConsumedOrderByCreatedAtDesc(String phone, String purpose, boolean consumed);
}
