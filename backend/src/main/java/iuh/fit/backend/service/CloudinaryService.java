package iuh.fit.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import io.github.cdimascio.dotenv.Dotenv;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Service for uploading images to Cloudinary
 * Only enabled when cloudinary.enabled=true in properties
 */
@Service
@ConditionalOnProperty(name = "cloudinary.enabled", havingValue = "true", matchIfMissing = false)
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService() {
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        
        String cloudName = dotenv.get("CLOUDINARY_CLOUD_NAME", "");
        String apiKey = dotenv.get("CLOUDINARY_API_KEY", "");
        String apiSecret = dotenv.get("CLOUDINARY_API_SECRET", "");
        
        if (cloudName.isEmpty() || apiKey.isEmpty() || apiSecret.isEmpty()) {
            log.warn("Cloudinary configuration is incomplete. Service will not function properly.");
        }
        
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", cloudName);
        config.put("api_key", apiKey);
        config.put("api_secret", apiSecret);
        config.put("secure", "true");
        
        this.cloudinary = new Cloudinary(config);
        
        log.info("CloudinaryService initialized. Cloud name: {}", 
                cloudName.isEmpty() ? "NOT_SET" : cloudName);
    }

    /**
     * Upload image to Cloudinary
     * 
     * @param file MultipartFile to upload
     * @param folder Folder name in Cloudinary (e.g., "products", "categories")
     * @return URL of uploaded image
     * @throws IOException if upload fails
     */
    public String uploadImage(MultipartFile file, String folder) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("File must be an image");
        }

        // Validate file size (max 10MB)
        long maxSize = 10 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("File size exceeds 10MB limit");
        }

        try {
            Map<String, Object> uploadParams = ObjectUtils.asMap(
                    "folder", folder,
                    "resource_type", "auto",
                    "overwrite", true,
                    "quality", "auto:good",
                    "fetch_format", "auto"
            );

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
            String imageUrl = (String) uploadResult.get("secure_url");
            
            log.info("Image uploaded successfully to Cloudinary: {}", imageUrl);
            return imageUrl;
        } catch (IOException e) {
            log.error("Failed to upload image to Cloudinary", e);
            throw new IOException("Failed to upload image: " + e.getMessage(), e);
        }
    }

    /**
     * Delete image from Cloudinary by URL
     * 
     * @param imageUrl URL of image to delete
     * @return true if deletion successful
     */
    public boolean deleteImage(String imageUrl) {
        try {
            // Extract public_id from URL
            String publicId = extractPublicIdFromUrl(imageUrl);
            if (publicId == null || publicId.isEmpty()) {
                log.warn("Could not extract public_id from URL: {}", imageUrl);
                return false;
            }

            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            String resultStatus = (String) result.get("result");
            
            boolean success = "ok".equals(resultStatus);
            log.info("Image deletion {} for public_id: {}", success ? "successful" : "failed", publicId);
            return success;
        } catch (Exception e) {
            log.error("Failed to delete image from Cloudinary: {}", imageUrl, e);
            return false;
        }
    }

    /**
     * Extract public_id from Cloudinary URL
     * Example: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/image.jpg
     * Returns: folder/image
     */
    private String extractPublicIdFromUrl(String url) {
        if (url == null || !url.contains("cloudinary.com")) {
            return null;
        }

        try {
            // Split by /upload/
            String[] parts = url.split("/upload/");
            if (parts.length < 2) {
                return null;
            }

            // Get everything after /upload/vXXXXXXXXXX/
            String afterUpload = parts[1];
            int versionIndex = afterUpload.indexOf('/');
            if (versionIndex == -1) {
                return null;
            }

            String pathWithExtension = afterUpload.substring(versionIndex + 1);
            
            // Remove file extension
            int lastDotIndex = pathWithExtension.lastIndexOf('.');
            if (lastDotIndex > 0) {
                return pathWithExtension.substring(0, lastDotIndex);
            }

            return pathWithExtension;
        } catch (Exception e) {
            log.error("Error extracting public_id from URL: {}", url, e);
            return null;
        }
    }
}
