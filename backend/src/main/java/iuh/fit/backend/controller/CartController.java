package iuh.fit.backend.controller;

import iuh.fit.backend.dto.AddToCartRequest;
import iuh.fit.backend.dto.CartResponse;
import iuh.fit.backend.dto.MergeCartRequest;
import iuh.fit.backend.dto.UpdateCartItemRequest;
import iuh.fit.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    // Get cart - User can only get their own cart, Admin/Manager can get any
    @PreAuthorize("isAuthenticated() and (#userId == authentication.principal.userId or hasAnyRole('ADMIN', 'MANAGER'))")
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getCartByUserId(@PathVariable Integer userId) {
        try {
            CartResponse response = cartService.getCartByUserId(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    // Add to cart - User can only add to their own cart
    @PreAuthorize("isAuthenticated() and #userId == authentication.principal.userId")
    @PostMapping("/user/{userId}/items")
    public ResponseEntity<?> addToCart(
            @PathVariable Integer userId,
            @RequestBody AddToCartRequest request) {
        try {
            CartResponse response = cartService.addToCart(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // Update cart item - User can only update their own cart
    @PreAuthorize("isAuthenticated() and #userId == authentication.principal.userId")
    @PutMapping("/user/{userId}/items/{cartItemId}")
    public ResponseEntity<?> updateCartItem(
            @PathVariable Integer userId,
            @PathVariable Integer cartItemId,
            @RequestBody UpdateCartItemRequest request) {
        try {
            CartResponse response = cartService.updateCartItem(userId, cartItemId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // Remove cart item - User can only remove from their own cart
    @PreAuthorize("isAuthenticated() and #userId == authentication.principal.userId")
    @DeleteMapping("/user/{userId}/items/{cartItemId}")
    public ResponseEntity<?> removeCartItem(
            @PathVariable Integer userId,
            @PathVariable Integer cartItemId) {
        try {
            CartResponse response = cartService.removeCartItem(userId, cartItemId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // Clear cart - User can only clear their own cart
    @PreAuthorize("isAuthenticated() and #userId == authentication.principal.userId")
    @DeleteMapping("/user/{userId}/clear")
    public ResponseEntity<?> clearCart(@PathVariable Integer userId) {
        try {
            cartService.clearCart(userId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Cart cleared successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // Merge guest cart into user cart - Called after login
    @PreAuthorize("isAuthenticated() and #userId == authentication.principal.userId")
    @PostMapping("/user/{userId}/merge")
    public ResponseEntity<?> mergeGuestCart(
            @PathVariable Integer userId,
            @RequestBody MergeCartRequest request) {
        try {
            CartResponse response = cartService.mergeGuestCart(userId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}
