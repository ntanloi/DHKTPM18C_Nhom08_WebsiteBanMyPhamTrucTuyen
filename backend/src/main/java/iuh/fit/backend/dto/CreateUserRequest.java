package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {
    private String fullName;
    private String email;
    private String password;
    private String phoneNumber;
    private String avatarUrl;
    private LocalDate birthDay;
    private Integer roleId;
}