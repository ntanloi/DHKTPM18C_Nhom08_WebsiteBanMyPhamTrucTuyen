package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Integer id;
    private Integer userId;
    private Integer productId;
    private String content;
    private Integer rating;
    private String title;
    private String email;
    private String nickname;
    private Boolean isRecommend;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ReviewImageResponse> reviewImages;
}