package iuh.fit.backend.controller;

import iuh.fit.backend.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller for handling image uploads to Cloudinary
 * Only enabled when CloudinaryService bean is available
 */
@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
@ConditionalOnBean(CloudinaryService.class)
@RequiredArgsConstructor
@Slf4j
public class UploadController {

    private final CloudinaryService cloudinaryService;

    /**
     * Upload a single image
     */
    @PostMapping("/image")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<?> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "products") String folder) {
        try {
            log.info("Uploading image: name={}, size={}, type={}, folder={}", 
                    file.getOriginalFilename(), file.getSize(), file.getContentType(), folder);

            String imageUrl = cloudinaryService.uploadImage(file, folder);

            Map<String, String> response = new HashMap<>();
            response.put("url", imageUrl);
            response.put("message", "Image uploaded successfully");

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Validation error: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            log.error("Failed to upload image", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to upload image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Upload multiple images
     */
    @PostMapping("/images")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<?> uploadImages(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(value = "folder", defaultValue = "products") String folder) {
        try {
            log.info("Uploading {} images to folder: {}", files.length, folder);

            List<String> uploadedUrls = new ArrayList<>();
            List<String> errors = new ArrayList<>();

            for (int i = 0; i < files.length; i++) {
                MultipartFile file = files[i];
                try {
                    String imageUrl = cloudinaryService.uploadImage(file, folder);
                    uploadedUrls.add(imageUrl);
                    log.info("Uploaded image {}/{}: {}", i + 1, files.length, file.getOriginalFilename());
                } catch (Exception e) {
                    String errorMsg = String.format("Failed to upload %s: %s", 
                            file.getOriginalFilename(), e.getMessage());
                    errors.add(errorMsg);
                    log.error(errorMsg);
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("urls", uploadedUrls);
            response.put("success", uploadedUrls.size());
            response.put("total", files.length);
            if (!errors.isEmpty()) {
                response.put("errors", errors);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to upload images", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to upload images: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Delete an image from Cloudinary
     */
    @DeleteMapping("/image")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<?> deleteImage(@RequestParam("url") String imageUrl) {
        try {
            log.info("Deleting image: {}", imageUrl);

            boolean deleted = cloudinaryService.deleteImage(imageUrl);

            Map<String, Object> response = new HashMap<>();
            response.put("success", deleted);
            response.put("message", deleted ? "Image deleted successfully" : "Failed to delete image");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to delete image", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to delete image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
