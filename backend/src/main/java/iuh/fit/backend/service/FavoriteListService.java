package iuh.fit.backend.service;

import iuh.fit.backend.dto.FavoriteListRequest;
import iuh.fit.backend.dto.FavoriteListResponse;
import iuh.fit.backend.model.FavoriteList;
import iuh.fit.backend.model.Product;
import iuh.fit.backend.model.ProductImage;
import iuh.fit.backend.model.ProductVariant;
import iuh.fit.backend.repository.FavoriteListRepository;
import iuh.fit.backend.repository.ProductImageRepository;
import iuh.fit.backend.repository.ProductRepository;
import iuh.fit.backend.repository.ProductVariantRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteListService {

    @Autowired
    private FavoriteListRepository favoriteListRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    public List<FavoriteListResponse> getAllFavorites() {
        return favoriteListRepository.findAll().stream()
                .map(this::convertToFavoriteListResponse)
                .collect(Collectors.toList());
    }

    public FavoriteListResponse getFavoriteById(Integer favoriteId) {
        FavoriteList favorite = favoriteListRepository.findById(favoriteId)
                .orElseThrow(() -> new RuntimeException("Favorite not found"));
        return convertToFavoriteListResponse(favorite);
    }

    public List<FavoriteListResponse> getFavoritesByUserId(Integer userId) {
        return favoriteListRepository.findByUserId(userId).stream()
                .map(this::convertToFavoriteListResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public FavoriteListResponse createFavorite(FavoriteListRequest request) {
        // Check if already exists
        if (favoriteListRepository.findByUserIdAndProductId(request.getUserId(), request.getProductId()).isPresent()) {
            throw new RuntimeException("Product already in favorite list");
        }

        FavoriteList favorite = new FavoriteList();
        favorite.setUserId(request.getUserId());
        favorite.setProductId(request.getProductId());

        FavoriteList savedFavorite = favoriteListRepository.save(favorite);
        return convertToFavoriteListResponse(savedFavorite);
    }

    @Transactional
    public void deleteFavorite(Integer favoriteId) {
        FavoriteList favorite = favoriteListRepository.findById(favoriteId)
                .orElseThrow(() -> new RuntimeException("Favorite not found"));
        favoriteListRepository.delete(favorite);
    }

    @Transactional
    public void deleteFavoriteByUserAndProduct(Integer userId, Integer productId) {
        FavoriteList favorite = favoriteListRepository.findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new RuntimeException("Favorite not found"));
        favoriteListRepository.delete(favorite);
    }

    private FavoriteListResponse convertToFavoriteListResponse(FavoriteList favorite) {
        FavoriteListResponse response = new FavoriteListResponse();
        response.setId(favorite.getId());
        response.setUserId(favorite.getUserId());
        response.setProductId(favorite.getProductId());

        // Get product details
        Product product = productRepository.findById(favorite.getProductId()).orElse(null);
        if (product != null) {
            response.setProductName(product.getName());
            response.setProductSlug(product.getSlug());

            // Get first product image
            List<ProductImage> images = productImageRepository.findByProductId(product.getId());
            if (!images.isEmpty()) {
                response.setProductImageUrl(images.get(0).getImageUrl());
            }

            // Get product variant price
            List<ProductVariant> variants = productVariantRepository.findByProductId(product.getId());
            if (!variants.isEmpty()) {
                ProductVariant variant = variants.get(0);
                response.setProductPrice(variant.getPrice());
                response.setProductSalePrice(variant.getSalePrice());
            }
        }

        return response;
    }
}