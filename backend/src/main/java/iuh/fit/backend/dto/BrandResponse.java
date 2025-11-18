package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BrandResponse {
    private Integer id;
    private String name;
    private String slug;
    private String logoUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}