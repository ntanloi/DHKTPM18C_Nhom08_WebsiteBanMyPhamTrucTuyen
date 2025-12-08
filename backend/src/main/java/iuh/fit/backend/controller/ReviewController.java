package iuh.fit.backend.controller;

import iuh.fit.backend.dto.ReviewRequest;
import iuh.fit.backend.dto.ReviewResponse;
import iuh.fit.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {
        List<ReviewResponse> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<?> getReviewById(@PathVariable Integer reviewId) {
        try {
            ReviewResponse response = reviewService.getReviewById(reviewId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByProductId(
            @PathVariable Integer productId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByProductId(productId);
        return ResponseEntity.ok(reviews);
    }

    // Get reviews by user ID - User can get their own, Admin/Manager can get any
    @PreAuthorize("isAuthenticated() and (#userId == authentication.principal.userId or hasAnyRole('ADMIN', 'MANAGER'))")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByUserId(
            @PathVariable Integer userId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByUserId(userId);
        return ResponseEntity.ok(reviews);
    }

    // Create review - Authenticated users only (verified purchase checked in service)
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody ReviewRequest request) {
        try {
            ReviewResponse response = reviewService.createReview(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // Update review - Authenticated users only (ownership checked in service)
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{reviewId}")
    public ResponseEntity<?> updateReview(
            @PathVariable Integer reviewId,
            @RequestBody ReviewRequest request) {
        try {
            ReviewResponse response = reviewService.updateReview(reviewId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // Delete review - Authenticated users only (ownership checked in service) or Admin
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Integer reviewId) {
        try {
            reviewService.deleteReview(reviewId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Review deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}