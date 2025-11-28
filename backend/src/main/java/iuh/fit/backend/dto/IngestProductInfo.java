package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IngestProductInfo {
    private String name;
    private String slug;
    private String description;
    private Integer categoryId;
    private String categoryName;
    private String categorySlug;
    private Integer brandId;
    private String brandName;
    private String brandSlug;
    private String status;
}
