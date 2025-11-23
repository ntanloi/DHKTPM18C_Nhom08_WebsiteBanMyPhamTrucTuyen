package iuh.fit.backend.service;

import iuh.fit.backend.config.OtpConfig;
import iuh.fit.backend.model.MailOtpCode;
import iuh.fit.backend.repository.MailOtpCodeRepository;
import iuh.fit.backend.util.OtpUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OtpService {
    private final MailOtpCodeRepository mailOtpCodeRepository;
    private final OtpUtil otpUtil;
    private final OtpConfig otpConfig;
    private final EmailService emailService;

    public void sendOtp(String email, String purpose) {
        String otp = otpUtil.generateOtp(otpConfig.getLength());

        MailOtpCode mailOtpCode = MailOtpCode.builder()
                .email(email)
                .code(otp)
                .purpose(purpose)
                .attempts(0)
                .expiresAt(LocalDateTime.now().plusMinutes(otpConfig.getExpiration()))
                .build();

        // Save or update the OTP code in the repository
        mailOtpCodeRepository.save(mailOtpCode);

        // Send the OTP via email
        emailService.sendOtp(email, otp);
    }

    public void verifyOtp(String email, String code, String purpose) {
        MailOtpCode mailOtpCode = mailOtpCodeRepository.findTopByEmailAndPurposeAndConsumedOrderByCreatedAtDesc(email, purpose, false)
                .orElseThrow(() -> new RuntimeException("OTP not found"));

        if(mailOtpCode.getAttempts() >= otpConfig.getMaxAttempts()) {
            throw new RuntimeException("Too many attempts");
        }

        if (mailOtpCode.getConsumed()) {
            throw new RuntimeException("OTP already consumed");
        }

        if (mailOtpCode.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }
        mailOtpCode.setAttempts(mailOtpCode.getAttempts() + 1);

        if (!mailOtpCode.getCode().equals(code)) {
            mailOtpCodeRepository.save(mailOtpCode);
            throw new RuntimeException("Invalid OTP code");
        }

        // Mark OTP as consumed
        mailOtpCode.setConsumed(true);
        mailOtpCodeRepository.save(mailOtpCode);
    }

}
