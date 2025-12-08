package iuh.fit.backend.service;

import iuh.fit.backend.dto.ReviewImageResponse;
import iuh.fit.backend.dto.ReviewRequest;
import iuh.fit.backend.dto.ReviewResponse;
import iuh.fit.backend.model.Review;
import iuh.fit.backend.model.ReviewImage;
import iuh.fit.backend.repository.OrderRepository;
import iuh.fit.backend.repository.ReviewImageRepository;
import iuh.fit.backend.repository.ReviewRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReviewImageRepository reviewImageRepository;
    
    @Autowired
    private OrderRepository orderRepository;

    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(this::convertToReviewResponse)
                .collect(Collectors.toList());
    }

    public ReviewResponse getReviewById(Integer reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        return convertToReviewResponse(review);
    }

    public List<ReviewResponse> getReviewsByProductId(Integer productId) {
        return reviewRepository.findByProductId(productId).stream()
                .map(this::convertToReviewResponse)
                .collect(Collectors.toList());
    }

    public List<ReviewResponse> getReviewsByUserId(Integer userId) {
        return reviewRepository.findByUserId(userId).stream()
                .map(this::convertToReviewResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewResponse createReview(ReviewRequest request) {
        // Verify that user has purchased and received this product
        if (!orderRepository.hasUserPurchasedProduct(request.getUserId(), request.getProductId())) {
            throw new RuntimeException("You can only review products you have purchased and received");
        }
        
        Review review = new Review();
        review.setUserId(request.getUserId());
        review.setProductId(request.getProductId());
        review.setContent(request.getContent());
        review.setRating(request.getRating());
        review.setTitle(request.getTitle());
        review.setEmail(request.getEmail());
        review.setNickname(request.getNickname());
        review.setIsRecommend(request.getIsRecommend());
        review.setCreatedAt(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());

        Review savedReview = reviewRepository.save(review);
        return convertToReviewResponse(savedReview);
    }

    @Transactional
    public ReviewResponse updateReview(Integer reviewId, ReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        review.setContent(request.getContent());
        review.setRating(request.getRating());
        review.setTitle(request.getTitle());
        review.setEmail(request.getEmail());
        review.setNickname(request.getNickname());
        review.setIsRecommend(request.getIsRecommend());
        review.setUpdatedAt(LocalDateTime.now());

        Review updatedReview = reviewRepository.save(review);
        return convertToReviewResponse(updatedReview);
    }

    @Transactional
    public void deleteReview(Integer reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        reviewRepository.delete(review);
    }

    private ReviewResponse convertToReviewResponse(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setUserId(review.getUserId());
        response.setProductId(review.getProductId());
        response.setContent(review.getContent());
        response.setRating(review.getRating());
        response.setTitle(review.getTitle());
        response.setEmail(review.getEmail());
        response.setNickname(review.getNickname());
        response.setIsRecommend(review.getIsRecommend());
        response.setCreatedAt(review.getCreatedAt());
        response.setUpdatedAt(review.getUpdatedAt());

        List<ReviewImage> images = reviewImageRepository.findByReviewId(review.getId());
        List<ReviewImageResponse> imageResponses = images.stream().map(image -> {
            ReviewImageResponse imageResponse = new ReviewImageResponse();
            imageResponse.setId(image.getId());
            imageResponse.setReviewId(image.getReviewId());
            imageResponse.setImageUrl(image.getImageUrl());
            return imageResponse;
        }).collect(Collectors.toList());
        response.setReviewImages(imageResponses);

        return response;
    }
}