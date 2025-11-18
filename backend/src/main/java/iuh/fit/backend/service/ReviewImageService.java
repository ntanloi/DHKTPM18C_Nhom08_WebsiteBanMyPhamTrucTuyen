package iuh.fit.backend.service;

import iuh.fit.backend.dto.ReviewImageRequest;
import iuh.fit.backend.dto.ReviewImageResponse;
import iuh.fit.backend.model.ReviewImage;
import iuh.fit.backend.repository.ReviewImageRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewImageService {

    @Autowired
    private ReviewImageRepository reviewImageRepository;

    public List<ReviewImageResponse> getAllReviewImages() {
        return reviewImageRepository.findAll().stream()
                .map(this::convertToReviewImageResponse)
                .collect(Collectors.toList());
    }

    public ReviewImageResponse getReviewImageById(Integer imageId) {
        ReviewImage image = reviewImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Review image not found"));
        return convertToReviewImageResponse(image);
    }

    public List<ReviewImageResponse> getReviewImagesByReviewId(Integer reviewId) {
        return reviewImageRepository.findByReviewId(reviewId).stream()
                .map(this::convertToReviewImageResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewImageResponse createReviewImage(ReviewImageRequest request) {
        ReviewImage image = new ReviewImage();
        image.setReviewId(request.getReviewId());
        image.setImageUrl(request.getImageUrl());

        ReviewImage savedImage = reviewImageRepository.save(image);
        return convertToReviewImageResponse(savedImage);
    }

    @Transactional
    public ReviewImageResponse updateReviewImage(Integer imageId, ReviewImageRequest request) {
        ReviewImage image = reviewImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Review image not found"));

        image.setReviewId(request.getReviewId());
        image.setImageUrl(request.getImageUrl());

        ReviewImage updatedImage = reviewImageRepository.save(image);
        return convertToReviewImageResponse(updatedImage);
    }

    @Transactional
    public void deleteReviewImage(Integer imageId) {
        ReviewImage image = reviewImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Review image not found"));
        reviewImageRepository.delete(image);
    }

    @Transactional
    public void deleteReviewImagesByReviewId(Integer reviewId) {
        List<ReviewImage> images = reviewImageRepository.findByReviewId(reviewId);
        reviewImageRepository.deleteAll(images);
    }

    private ReviewImageResponse convertToReviewImageResponse(ReviewImage image) {
        ReviewImageResponse response = new ReviewImageResponse();
        response.setId(image.getId());
        response.setReviewId(image.getReviewId());
        response.setImageUrl(image.getImageUrl());
        return response;
    }
}