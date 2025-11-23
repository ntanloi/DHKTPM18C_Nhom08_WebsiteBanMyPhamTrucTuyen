package iuh.fit.backend.controller;

import iuh.fit.backend.dto.ReviewImageRequest;
import iuh.fit.backend.dto.ReviewImageResponse;
import iuh.fit.backend.service.ReviewImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/review-images")
@CrossOrigin(origins = "*")
public class ReviewImageController {

    @Autowired
    private ReviewImageService reviewImageService;

    @GetMapping
    public ResponseEntity<List<ReviewImageResponse>> getAllReviewImages() {
        List<ReviewImageResponse> images = reviewImageService.getAllReviewImages();
        return ResponseEntity.ok(images);
    }

    @GetMapping("/{imageId}")
    public ResponseEntity<?> getReviewImageById(@PathVariable Integer imageId) {
        try {
            ReviewImageResponse response = reviewImageService.getReviewImageById(imageId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @GetMapping("/review/{reviewId}")
    public ResponseEntity<List<ReviewImageResponse>> getReviewImagesByReviewId(
            @PathVariable Integer reviewId) {
        List<ReviewImageResponse> images = reviewImageService.getReviewImagesByReviewId(reviewId);
        return ResponseEntity.ok(images);
    }

    @PostMapping
    public ResponseEntity<?> createReviewImage(@RequestBody ReviewImageRequest request) {
        try {
            ReviewImageResponse response = reviewImageService.createReviewImage(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PutMapping("/{imageId}")
    public ResponseEntity<?> updateReviewImage(
            @PathVariable Integer imageId,
            @RequestBody ReviewImageRequest request) {
        try {
            ReviewImageResponse response = reviewImageService.updateReviewImage(imageId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<?> deleteReviewImage(@PathVariable Integer imageId) {
        try {
            reviewImageService.deleteReviewImage(imageId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Review image deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @DeleteMapping("/review/{reviewId}")
    public ResponseEntity<?> deleteReviewImagesByReviewId(@PathVariable Integer reviewId) {
        try {
            reviewImageService.deleteReviewImagesByReviewId(reviewId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "All review images deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}