package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VariantAttributeResponse {
    private Integer id;
    private Integer productVariantId;
    private String name;
    private String value;
}