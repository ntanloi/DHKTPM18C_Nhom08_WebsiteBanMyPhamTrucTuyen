package iuh.fit.backend.repository;

import iuh.fit.backend.model.MailOtpCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MailOtpCodeRepository extends JpaRepository<MailOtpCode, Integer> {
    Optional<MailOtpCode> findTopByEmailAndPurposeAndConsumedOrderByCreatedAtDesc(String email, String purpose, boolean consumed);
}
