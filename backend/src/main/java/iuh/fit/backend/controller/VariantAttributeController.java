package iuh.fit.backend.controller;

import iuh.fit.backend.dto.VariantAttributeRequest;
import iuh.fit.backend.dto.VariantAttributeResponse;
import iuh.fit.backend.service.VariantAttributeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/variant-attributes")
@CrossOrigin(origins = "*")
public class VariantAttributeController {

    @Autowired
    private VariantAttributeService variantAttributeService;

    @GetMapping
    public ResponseEntity<List<VariantAttributeResponse>> getAllVariantAttributes() {
        List<VariantAttributeResponse> attributes = variantAttributeService.getAllVariantAttributes();
        return ResponseEntity.ok(attributes);
    }

    @GetMapping("/{attributeId}")
    public ResponseEntity<?> getVariantAttributeById(@PathVariable Integer attributeId) {
        try {
            VariantAttributeResponse response = variantAttributeService.getVariantAttributeById(attributeId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @GetMapping("/variant/{productVariantId}")
    public ResponseEntity<List<VariantAttributeResponse>> getVariantAttributesByProductVariantId(
            @PathVariable Integer productVariantId) {
        List<VariantAttributeResponse> attributes = variantAttributeService.getVariantAttributesByProductVariantId(productVariantId);
        return ResponseEntity.ok(attributes);
    }

    @PostMapping
    public ResponseEntity<?> createVariantAttribute(@RequestBody VariantAttributeRequest request) {
        try {
            VariantAttributeResponse response = variantAttributeService.createVariantAttribute(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PutMapping("/{attributeId}")
    public ResponseEntity<?> updateVariantAttribute(
            @PathVariable Integer attributeId,
            @RequestBody VariantAttributeRequest request) {
        try {
            VariantAttributeResponse response = variantAttributeService.updateVariantAttribute(attributeId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @DeleteMapping("/{attributeId}")
    public ResponseEntity<?> deleteVariantAttribute(@PathVariable Integer attributeId) {
        try {
            variantAttributeService.deleteVariantAttribute(attributeId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Variant attribute deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}