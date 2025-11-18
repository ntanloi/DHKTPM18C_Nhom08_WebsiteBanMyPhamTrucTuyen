package iuh.fit.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {
    private Integer userId;
    private Integer productId;
    private String content;
    private Integer rating;
    private String title;
    private String email;
    private String nickname;
    private Boolean isRecommend;
}