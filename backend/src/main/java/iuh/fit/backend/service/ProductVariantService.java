package iuh.fit.backend.service;

import iuh.fit.backend.dto.ProductVariantRequest;
import iuh.fit.backend.dto.ProductVariantResponse;
import iuh.fit.backend.dto.VariantAttributeResponse;
import iuh.fit.backend.model.ProductVariant;
import iuh.fit.backend.model.VariantAttribute;
import iuh.fit.backend.repository.ProductRepository;
import iuh.fit.backend.repository.ProductVariantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductVariantService {

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<ProductVariantResponse> getAllProductVariants() {
        return productVariantRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ProductVariantResponse getProductVariantById(Integer id) {
        ProductVariant variant = productVariantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product variant not found with id: " + id));
        return convertToResponse(variant);
    }

    public List<ProductVariantResponse> getProductVariantsByProductId(Integer productId) {
        return productVariantRepository.findByProductId(productId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ProductVariantResponse getProductVariantBySku(String sku) {
        ProductVariant variant = productVariantRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Product variant not found with SKU: " + sku));
        return convertToResponse(variant);
    }

    public List<ProductVariantResponse> getInStockProductVariants() {
        return productVariantRepository.findInStockVariants()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductVariantResponse createProductVariant(ProductVariantRequest request) {
        // Validate product exists
        if (!productRepository.existsById(request.getProductId())) {
            throw new RuntimeException("Product not found with id: " + request.getProductId());
        }

        // Check if SKU already exists
        if (productVariantRepository.existsBySku(request.getSku())) {
            throw new RuntimeException("Product variant with SKU " + request.getSku() + " already exists");
        }

        ProductVariant variant = new ProductVariant();
        variant.setProductId(request.getProductId());
        variant.setName(request.getName());
        variant.setSku(request.getSku());
        variant.setPrice(request.getPrice());
        variant.setSalePrice(request.getSalePrice());
        variant.setStockQuantity(request.getStockQuantity());

        ProductVariant savedVariant = productVariantRepository.save(variant);
        return convertToResponse(savedVariant);
    }

    @Transactional
    public ProductVariantResponse updateProductVariant(Integer id, ProductVariantRequest request) {
        ProductVariant variant = productVariantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product variant not found with id: " + id));

        // Check if SKU is being changed and if the new SKU already exists
        if (!variant.getSku().equals(request.getSku()) &&
                productVariantRepository.existsBySkuAndIdNot(request.getSku(), id)) {
            throw new RuntimeException("Product variant with SKU " + request.getSku() + " already exists");
        }

        // Validate product exists if productId is being changed
        if (!variant.getProductId().equals(request.getProductId()) &&
                !productRepository.existsById(request.getProductId())) {
            throw new RuntimeException("Product not found with id: " + request.getProductId());
        }

        variant.setProductId(request.getProductId());
        variant.setName(request.getName());
        variant.setSku(request.getSku());
        variant.setPrice(request.getPrice());
        variant.setSalePrice(request.getSalePrice());
        variant.setStockQuantity(request.getStockQuantity());

        ProductVariant updatedVariant = productVariantRepository.save(variant);
        return convertToResponse(updatedVariant);
    }

    @Transactional
    public ProductVariantResponse updateStock(Integer id, Integer quantity) {
        ProductVariant variant = productVariantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product variant not found with id: " + id));

        if (quantity < 0) {
            throw new RuntimeException("Stock quantity cannot be negative");
        }

        variant.setStockQuantity(quantity);
        ProductVariant updatedVariant = productVariantRepository.save(variant);
        return convertToResponse(updatedVariant);
    }

    @Transactional
    public void deleteProductVariant(Integer id) {
        if (!productVariantRepository.existsById(id)) {
            throw new RuntimeException("Product variant not found with id: " + id);
        }
        productVariantRepository.deleteById(id);
    }

    private ProductVariantResponse convertToResponse(ProductVariant variant) {
        ProductVariantResponse response = new ProductVariantResponse();
        response.setId(variant.getId());
        response.setProductId(variant.getProductId());
        response.setName(variant.getName());
        response.setSku(variant.getSku());
        response.setPrice(variant.getPrice());
        response.setSalePrice(variant.getSalePrice());
        response.setStockQuantity(variant.getStockQuantity());

        // Convert variant attributes if they exist
        if (variant.getVariantAttributes() != null) {
            List<VariantAttributeResponse> attributes = variant.getVariantAttributes()
                    .stream()
                    .map(this::convertAttributeToResponse)
                    .collect(Collectors.toList());
            response.setAttributes(attributes);
        }

        return response;
    }

    private VariantAttributeResponse convertAttributeToResponse(VariantAttribute attribute) {
        VariantAttributeResponse response = new VariantAttributeResponse();
        response.setId(attribute.getId());
        response.setProductVariantId(attribute.getProductVariantId());
        response.setName(attribute.getName());
        response.setValue(attribute.getValue());
        return response;
    }
}