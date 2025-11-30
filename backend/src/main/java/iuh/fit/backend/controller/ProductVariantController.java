package iuh.fit.backend.controller;

import iuh.fit.backend.dto.ProductVariantRequest;
import iuh.fit.backend.dto.ProductVariantResponse;
import iuh.fit.backend.service.ProductVariantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product-variants")
@CrossOrigin(origins = "*")
public class ProductVariantController {

    @Autowired
    private ProductVariantService productVariantService;

    @GetMapping
    public ResponseEntity<List<ProductVariantResponse>> getAllProductVariants() {
        List<ProductVariantResponse> variants = productVariantService.getAllProductVariants();
        return ResponseEntity.ok(variants);
    }

    @GetMapping("/{variantId}")
    public ResponseEntity<?> getProductVariantById(@PathVariable Integer variantId) {
        try {
            ProductVariantResponse response = productVariantService.getProductVariantById(variantId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductVariantResponse>> getProductVariantsByProductId(
            @PathVariable Integer productId) {
        List<ProductVariantResponse> variants = productVariantService.getProductVariantsByProductId(productId);
        return ResponseEntity.ok(variants);
    }

    @GetMapping("/sku/{sku}")
    public ResponseEntity<?> getProductVariantBySku(@PathVariable String sku) {
        try {
            ProductVariantResponse response = productVariantService.getProductVariantBySku(sku);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @GetMapping("/in-stock")
    public ResponseEntity<List<ProductVariantResponse>> getInStockProductVariants() {
        List<ProductVariantResponse> variants = productVariantService.getInStockProductVariants();
        return ResponseEntity.ok(variants);
    }

    @PostMapping
    public ResponseEntity<?> createProductVariant(@RequestBody ProductVariantRequest request) {
        try {
            ProductVariantResponse response = productVariantService.createProductVariant(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PutMapping("/{variantId}")
    public ResponseEntity<?> updateProductVariant(
            @PathVariable Integer variantId,
            @RequestBody ProductVariantRequest request) {
        try {
            ProductVariantResponse response = productVariantService.updateProductVariant(variantId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PatchMapping("/{variantId}/stock")
    public ResponseEntity<?> updateStock(
            @PathVariable Integer variantId,
            @RequestParam Integer quantity) {
        try {
            ProductVariantResponse response = productVariantService.updateStock(variantId, quantity);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @DeleteMapping("/{variantId}")
    public ResponseEntity<?> deleteProductVariant(@PathVariable Integer variantId) {
        try {
            productVariantService.deleteProductVariant(variantId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Product variant deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}