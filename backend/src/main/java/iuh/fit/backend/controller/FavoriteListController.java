package iuh.fit.backend.controller;

import iuh.fit.backend.dto.FavoriteListRequest;
import iuh.fit.backend.dto.FavoriteListResponse;
import iuh.fit.backend.service.FavoriteListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*")
public class FavoriteListController {

    @Autowired
    private FavoriteListService favoriteListService;

    // Get all favorites - Admin/Manager only
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @GetMapping
    public ResponseEntity<List<FavoriteListResponse>> getAllFavorites() {
        List<FavoriteListResponse> favorites = favoriteListService.getAllFavorites();
        return ResponseEntity.ok(favorites);
    }

    // Get favorite by ID - User can get their own, Admin/Manager can get any
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{favoriteId}")
    public ResponseEntity<?> getFavoriteById(@PathVariable Integer favoriteId) {
        try {
            FavoriteListResponse response = favoriteListService.getFavoriteById(favoriteId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    // Get favorites by user ID - User can get their own, Admin/Manager can get any
    @PreAuthorize("isAuthenticated() and (#userId == authentication.principal.userId or hasAnyRole('ADMIN', 'MANAGER'))")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FavoriteListResponse>> getFavoritesByUserId(
            @PathVariable Integer userId) {
        List<FavoriteListResponse> favorites = favoriteListService.getFavoritesByUserId(userId);
        return ResponseEntity.ok(favorites);
    }

    // Add to favorites - Authenticated users only
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<?> createFavorite(@RequestBody FavoriteListRequest request) {
        try {
            FavoriteListResponse response = favoriteListService.createFavorite(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // Remove from favorites - Authenticated users only
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{favoriteId}")
    public ResponseEntity<?> deleteFavorite(@PathVariable Integer favoriteId) {
        try {
            favoriteListService.deleteFavorite(favoriteId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Favorite deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // Remove from favorites by user and product - User can remove their own, Admin can remove any
    @PreAuthorize("isAuthenticated() and (#userId == authentication.principal.userId or hasRole('ADMIN'))")
    @DeleteMapping("/user/{userId}/product/{productId}")
    public ResponseEntity<?> deleteFavoriteByUserAndProduct(
            @PathVariable Integer userId,
            @PathVariable Integer productId) {
        try {
            favoriteListService.deleteFavoriteByUserAndProduct(userId, productId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Favorite deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}