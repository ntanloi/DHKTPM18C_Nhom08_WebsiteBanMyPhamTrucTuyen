package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IngestProductRequest {
    private IngestProductInfo product;
    private List<IngestVariantRequest> variants;
    private List<IngestImageRequest> images;
}
