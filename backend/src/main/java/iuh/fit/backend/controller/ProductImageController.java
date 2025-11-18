package iuh.fit.backend.controller;

import iuh.fit.backend.dto.ProductImageRequest;
import iuh.fit.backend.dto.ProductImageResponse;
import iuh.fit.backend.service.ProductImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product-images")
@CrossOrigin(origins = "*")
public class ProductImageController {

    @Autowired
    private ProductImageService productImageService;

    @GetMapping
    public ResponseEntity<List<ProductImageResponse>> getAllProductImages() {
        List<ProductImageResponse> images = productImageService.getAllProductImages();
        return ResponseEntity.ok(images);
    }

    @GetMapping("/{imageId}")
    public ResponseEntity<?> getProductImageById(@PathVariable Integer imageId) {
        try {
            ProductImageResponse response = productImageService.getProductImageById(imageId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductImageResponse>> getProductImagesByProductId(
            @PathVariable Integer productId) {
        List<ProductImageResponse> images = productImageService.getProductImagesByProductId(productId);
        return ResponseEntity.ok(images);
    }

    @PostMapping
    public ResponseEntity<?> createProductImage(@RequestBody ProductImageRequest request) {
        try {
            ProductImageResponse response = productImageService.createProductImage(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PutMapping("/{imageId}")
    public ResponseEntity<?> updateProductImage(
            @PathVariable Integer imageId,
            @RequestBody ProductImageRequest request) {
        try {
            ProductImageResponse response = productImageService.updateProductImage(imageId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<?> deleteProductImage(@PathVariable Integer imageId) {
        try {
            productImageService.deleteProductImage(imageId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Product image deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}