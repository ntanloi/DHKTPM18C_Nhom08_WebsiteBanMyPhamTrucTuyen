package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAddressRequest {
    private String recipientName;
    private String recipientPhone;
    private String streetAddress;
    private String ward;
    private String district;
    private String city;
    private Boolean isDefault;
}
