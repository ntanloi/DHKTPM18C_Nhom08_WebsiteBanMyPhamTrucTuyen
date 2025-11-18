package iuh.fit.backend.service;

import iuh.fit.backend.dto.ProductImageRequest;
import iuh.fit.backend.dto.ProductImageResponse;
import iuh.fit.backend.model.ProductImage;
import iuh.fit.backend.repository.ProductImageRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductImageService {

    @Autowired
    private ProductImageRepository productImageRepository;

    public List<ProductImageResponse> getAllProductImages() {
        return productImageRepository.findAll().stream()
                .map(this::convertToProductImageResponse)
                .collect(Collectors.toList());
    }

    public ProductImageResponse getProductImageById(Integer imageId) {
        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Product image not found"));
        return convertToProductImageResponse(image);
    }

    public List<ProductImageResponse> getProductImagesByProductId(Integer productId) {
        return productImageRepository.findByProductId(productId).stream()
                .map(this::convertToProductImageResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductImageResponse createProductImage(ProductImageRequest request) {
        ProductImage image = new ProductImage();
        image.setProductId(request.getProductId());
        image.setImageUrl(request.getImageUrl());

        ProductImage savedImage = productImageRepository.save(image);
        return convertToProductImageResponse(savedImage);
    }

    @Transactional
    public ProductImageResponse updateProductImage(Integer imageId, ProductImageRequest request) {
        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Product image not found"));

        image.setProductId(request.getProductId());
        image.setImageUrl(request.getImageUrl());

        ProductImage updatedImage = productImageRepository.save(image);
        return convertToProductImageResponse(updatedImage);
    }

    @Transactional
    public void deleteProductImage(Integer imageId) {
        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Product image not found"));
        productImageRepository.delete(image);
    }

    private ProductImageResponse convertToProductImageResponse(ProductImage image) {
        ProductImageResponse response = new ProductImageResponse();
        response.setId(image.getId());
        response.setProductId(image.getProductId());
        response.setImageUrl(image.getImageUrl());
        return response;
    }
}