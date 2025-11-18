package iuh.fit.backend.controller;

import iuh.fit.backend.dto.AddToCartRequest;
import iuh.fit.backend.dto.CartResponse;
import iuh.fit.backend.dto.UpdateCartItemRequest;
import iuh.fit.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

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
}