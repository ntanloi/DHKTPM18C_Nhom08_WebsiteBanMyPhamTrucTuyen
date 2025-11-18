package iuh.fit.backend.service;

import iuh.fit.backend.dto.*;
import iuh.fit.backend.model.*;
import iuh.fit.backend.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Autowired
    private VariantAttributeRepository variantAttributeRepository;

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToProductResponse)
                .collect(Collectors.toList());
    }

    public ProductDetailResponse getProductById(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return convertToProductDetailResponse(product);
    }

    public ProductDetailResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return convertToProductDetailResponse(product);
    }

    public List<ProductResponse> getProductsByCategoryId(Integer categoryId) {
        return productRepository.findByCategoryId(categoryId).stream()
                .map(this::convertToProductResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getProductsByBrandId(Integer brandId) {
        return productRepository.findByBrandId(brandId).stream()
                .map(this::convertToProductResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getProductsByStatus(String status) {
        return productRepository.findByStatus(status).stream()
                .map(this::convertToProductResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setSlug(request.getSlug());
        product.setDescription(request.getDescription());
        product.setCategoryId(request.getCategoryId());
        product.setBrandId(request.getBrandId());
        product.setStatus(request.getStatus());
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        Product savedProduct = productRepository.save(product);
        return convertToProductResponse(savedProduct);
    }

    @Transactional
    public ProductResponse updateProduct(Integer productId, ProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(request.getName());
        product.setSlug(request.getSlug());
        product.setDescription(request.getDescription());
        product.setCategoryId(request.getCategoryId());
        product.setBrandId(request.getBrandId());
        product.setStatus(request.getStatus());
        product.setUpdatedAt(LocalDateTime.now());

        Product updatedProduct = productRepository.save(product);
        return convertToProductResponse(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        productRepository.delete(product);
    }

    private ProductResponse convertToProductResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setSlug(product.getSlug());
        response.setDescription(product.getDescription());
        response.setCategoryId(product.getCategoryId());
        response.setBrandId(product.getBrandId());
        response.setStatus(product.getStatus());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());

        if (product.getCategory() != null) {
            response.setCategoryName(product.getCategory().getName());
        }

        if (product.getBrand() != null) {
            response.setBrandName(product.getBrand().getName());
        }

        return response;
    }

    private ProductDetailResponse convertToProductDetailResponse(Product product) {
        ProductDetailResponse response = new ProductDetailResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setSlug(product.getSlug());
        response.setDescription(product.getDescription());
        response.setCategoryId(product.getCategoryId());
        response.setBrandId(product.getBrandId());
        response.setStatus(product.getStatus());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());

        if (product.getCategory() != null) {
            response.setCategoryName(product.getCategory().getName());
        }

        if (product.getBrand() != null) {
            response.setBrandName(product.getBrand().getName());
        }

        List<ProductImage> images = productImageRepository.findByProductId(product.getId());
        List<ProductImageResponse> imageResponses = images.stream().map(image -> {
            ProductImageResponse imageResponse = new ProductImageResponse();
            imageResponse.setId(image.getId());
            imageResponse.setProductId(image.getProductId());
            imageResponse.setImageUrl(image.getImageUrl());
            return imageResponse;
        }).collect(Collectors.toList());
        response.setImages(imageResponses);

        List<ProductVariant> variants = productVariantRepository.findByProductId(product.getId());
        List<ProductVariantResponse> variantResponses = variants.stream().map(variant -> {
            ProductVariantResponse variantResponse = new ProductVariantResponse();
            variantResponse.setId(variant.getId());
            variantResponse.setProductId(variant.getProductId());
            variantResponse.setName(variant.getName());
            variantResponse.setSku(variant.getSku());
            variantResponse.setPrice(variant.getPrice());
            variantResponse.setSalePrice(variant.getSalePrice());
            variantResponse.setStockQuantity(variant.getStockQuantity());

            List<VariantAttribute> attributes = variantAttributeRepository.findByProductVariantId(variant.getId());
            List<VariantAttributeResponse> attributeResponses = attributes.stream().map(attr -> {
                VariantAttributeResponse attrResponse = new VariantAttributeResponse();
                attrResponse.setId(attr.getId());
                attrResponse.setName(attr.getName());
                attrResponse.setValue(attr.getValue());
                return attrResponse;
            }).collect(Collectors.toList());
            variantResponse.setAttributes(attributeResponses);

            return variantResponse;
        }).collect(Collectors.toList());
        response.setVariants(variantResponses);

        return response;
    }
}