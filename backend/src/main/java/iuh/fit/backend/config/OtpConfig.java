package iuh.fit.backend.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class OtpConfig {
    @Value("${otp.expiration:300000}")
    private Long expiration;

    @Value("${otp.max-attempts:5}")
    private Integer maxAttempts;

    @Value("${otp.length:6}")
    private Integer length;
}
