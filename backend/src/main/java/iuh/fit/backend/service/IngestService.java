package iuh.fit.backend.service;

import iuh.fit.backend.dto.IngestImageRequest;
import iuh.fit.backend.dto.IngestProductInfo;
import iuh.fit.backend.dto.IngestProductRequest;
import iuh.fit.backend.dto.IngestResult;
import iuh.fit.backend.dto.IngestVariantRequest;
import iuh.fit.backend.model.Brand;
import iuh.fit.backend.model.Category;
import iuh.fit.backend.model.Product;
import iuh.fit.backend.model.ProductImage;
import iuh.fit.backend.model.ProductVariant;
import iuh.fit.backend.repository.BrandRepository;
import iuh.fit.backend.repository.CategoryRepository;
import iuh.fit.backend.repository.ProductImageRepository;
import iuh.fit.backend.repository.ProductRepository;
import iuh.fit.backend.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class IngestService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;

    /**
     * Scheduled job to automatically ingest products daily at 2 AM
     * This would typically call an external API or data source
     */
    @Scheduled(cron = "0 0 2 * * *", zone = "Asia/Ho_Chi_Minh")
    public void scheduledIngest() {
        log.info("Starting scheduled product ingest at {}", LocalDateTime.now());
        try {
            // In a real implementation, this would:
            // 1. Call external API or read from data source
            // 2. Transform data to IngestProductRequest format
            // 3. Call ingest() method
            
            // Example: List<IngestProductRequest> products = fetchFromExternalSource();
            // List<IngestResult> results = ingest(products);
            
            log.info("Scheduled ingest would run here - configure external data source");
            log.info("To enable: uncomment and implement fetchFromExternalSource() method");
            
            // Placeholder for future implementation
            // When ready, replace the above logs with actual ingest logic
        } catch (Exception e) {
            log.error("Scheduled ingest failed: {}", e.getMessage(), e);
        }
    }

    @Transactional
    public List<IngestResult> ingest(List<IngestProductRequest> requests) {
        List<IngestResult> results = new ArrayList<>();
        for (IngestProductRequest request : requests) {
            IngestProductInfo productInfo = request.getProduct();
            if (productInfo == null) {
                results.add(new IngestResult(null, null, "Skipped: missing product body"));
                continue;
            }
            Integer brandId = resolveBrand(productInfo);
            Integer categoryId = resolveCategory(productInfo);
            Product product = upsertProduct(productInfo, brandId, categoryId);
            replaceVariants(product.getId(), request.getVariants());
            replaceImages(product.getId(), request.getImages());
            results.add(new IngestResult(product.getId(), product.getSlug(), "ok"));
        }
        return results;
    }

    private Product upsertProduct(IngestProductInfo info, Integer brandId, Integer categoryId) {
        String slug = (info.getSlug() != null && !info.getSlug().isBlank())
                ? info.getSlug().trim()
                : slugify(info.getName());
        LocalDateTime now = LocalDateTime.now();
        Optional<Product> existingOpt = productRepository.findBySlug(slug);
        Product product = existingOpt.orElseGet(Product::new);
        boolean isNew = product.getId() == null;

        product.setName(info.getName());
        product.setSlug(slug);
        product.setDescription(info.getDescription());
        product.setCategoryId(categoryId);
        product.setBrandId(brandId);
        product.setStatus(info.getStatus() != null ? info.getStatus() : "ACTIVE");
        if (isNew) {
            product.setCreatedAt(now);
        }
        product.setUpdatedAt(now);

        return productRepository.save(product);
    }

    private Integer resolveBrand(IngestProductInfo info) {
        if (info.getBrandId() != null) {
            return info.getBrandId();
        }
        String name = info.getBrandName();
        String slug = info.getBrandSlug();
        if (slug == null || slug.isBlank()) {
            slug = slugify(name);
        }
        if (slug == null || slug.isBlank()) {
            return null;
        }
        Optional<Brand> existing = brandRepository.findBySlug(slug);
        if (existing.isPresent()) {
            return existing.get().getId();
        }
        if (name == null || name.isBlank()) {
            return null;
        }
        Brand brand = new Brand();
        brand.setName(name);
        brand.setSlug(slug);
        brand.setLogoUrl(null);
        brand.setCreatedAt(LocalDateTime.now());
        brand.setUpdatedAt(LocalDateTime.now());
        return brandRepository.save(brand).getId();
    }

    private Integer resolveCategory(IngestProductInfo info) {
        if (info.getCategoryId() != null) {
            return info.getCategoryId();
        }
        String name = info.getCategoryName();
        String slug = info.getCategorySlug();
        if (slug == null || slug.isBlank()) {
            slug = slugify(name);
        }
        if (slug == null || slug.isBlank()) {
            return null;
        }
        Optional<Category> existing = categoryRepository.findBySlug(slug);
        if (existing.isPresent()) {
            return existing.get().getId();
        }
        if (name == null || name.isBlank()) {
            return null;
        }
        Category category = new Category();
        category.setName(name);
        category.setSlug(slug);
        category.setParentCategoryId(null);
        category.setImageUrl(null);
        category.setCreatedAt(LocalDateTime.now());
        category.setUpdatedAt(LocalDateTime.now());
        return categoryRepository.save(category).getId();
    }

    private void replaceVariants(Integer productId, List<IngestVariantRequest> variants) {
        List<ProductVariant> existing = productVariantRepository.findByProductId(productId);
        if (!existing.isEmpty()) {
            productVariantRepository.deleteAll(existing);
        }
        if (variants == null || variants.isEmpty()) {
            return;
        }
        List<ProductVariant> toSave = new ArrayList<>();
        for (IngestVariantRequest variant : variants) {
            ProductVariant pv = new ProductVariant();
            pv.setProductId(productId);
            pv.setName(variant.getName());
            pv.setSku(variant.getSku());
            pv.setPrice(variant.getPrice());
            pv.setSalePrice(variant.getSalePrice());
            pv.setStockQuantity(variant.getStockQuantity() != null ? variant.getStockQuantity() : 0);
            toSave.add(pv);
        }
        productVariantRepository.saveAll(toSave);
    }

    private void replaceImages(Integer productId, List<IngestImageRequest> images) {
        List<ProductImage> existing = productImageRepository.findByProductId(productId);
        if (!existing.isEmpty()) {
            productImageRepository.deleteAll(existing);
        }
        if (images == null || images.isEmpty()) {
            return;
        }
        List<ProductImage> toSave = new ArrayList<>();
        for (IngestImageRequest img : images) {
            if (img.getImageUrl() == null || img.getImageUrl().isBlank()) {
                continue;
            }
            ProductImage pi = new ProductImage();
            pi.setProductId(productId);
            pi.setImageUrl(img.getImageUrl());
            toSave.add(pi);
        }
        productImageRepository.saveAll(toSave);
    }

    private String slugify(String text) {
        if (text == null) return null;
        String ascii = java.text.Normalizer.normalize(text, java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        String cleaned = ascii.replaceAll("[^a-zA-Z0-9\\s-]", " ").trim().toLowerCase(Locale.ROOT);
        return cleaned.replaceAll("\\s+", "-");
    }
}
