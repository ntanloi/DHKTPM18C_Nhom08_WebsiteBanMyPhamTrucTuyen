package iuh.fit.backend.service;

import iuh.fit.backend.dto.*;
import iuh.fit.backend.model.Cart;
import iuh.fit.backend.model.CartItem;
import iuh.fit.backend.model.ProductImage;
import iuh.fit.backend.model.ProductVariant;
import iuh.fit.backend.repository.CartItemRepository;
import iuh.fit.backend.repository.CartRepository;
import iuh.fit.backend.repository.ProductImageRepository;
import iuh.fit.backend.repository.ProductVariantRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;
    
    @Autowired
    private ProductImageRepository productImageRepository;

    @Transactional
    public CartResponse getCartByUserId(Integer userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createCartForUser(userId));
        return convertToCartResponse(cart);
    }

    @Transactional
    public CartResponse addToCart(Integer userId, AddToCartRequest request) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createCartForUser(userId));

        ProductVariant variant = productVariantRepository.findById(request.getProductVariantId())
                .orElseThrow(() -> new RuntimeException("Product variant not found"));

        if (variant.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock for product: " + variant.getName());
        }

        Optional<CartItem> existingItem = cartItemRepository
                .findByCartIdAndProductVariantId(cart.getId(), request.getProductVariantId());

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + request.getQuantity();
            if (variant.getStockQuantity() < newQuantity) {
                throw new RuntimeException("Insufficient stock for product: " + variant.getName());
            }
            item.setQuantity(newQuantity);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCartId(cart.getId());
            newItem.setProductVariantId(request.getProductVariantId());
            newItem.setQuantity(request.getQuantity());
            cartItemRepository.save(newItem);
        }

        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);

        return convertToCartResponse(cart);
    }

    @Transactional
    public CartResponse updateCartItem(Integer userId, Integer cartItemId, UpdateCartItemRequest request) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getCartId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to this cart");
        }

        ProductVariant variant = productVariantRepository.findById(cartItem.getProductVariantId())
                .orElseThrow(() -> new RuntimeException("Product variant not found"));

        if (variant.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock for product: " + variant.getName());
        }

        cartItem.setQuantity(request.getQuantity());
        cartItemRepository.save(cartItem);

        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);

        return convertToCartResponse(cart);
    }

    @Transactional
    public CartResponse removeCartItem(Integer userId, Integer cartItemId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getCartId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to this cart");
        }

        cartItemRepository.delete(cartItem);

        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);

        return convertToCartResponse(cart);
    }

    @Transactional
    public void clearCart(Integer userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cartItemRepository.deleteByCartId(cart.getId());

        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
    }

    private Cart createCartForUser(Integer userId) {
        Cart cart = new Cart();
        cart.setUserId(userId);
        cart.setCreatedAt(LocalDateTime.now());
        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }

    private CartResponse convertToCartResponse(Cart cart) {
        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setUserId(cart.getUserId());
        response.setCreatedAt(cart.getCreatedAt());
        response.setUpdatedAt(cart.getUpdatedAt());

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        BigDecimal totalAmount = BigDecimal.ZERO;

        List<CartItemResponse> itemResponses = cartItems.stream().map(item -> {
            CartItemResponse itemResponse = new CartItemResponse();
            itemResponse.setId(item.getId());
            itemResponse.setProductVariantId(item.getProductVariantId());
            itemResponse.setQuantity(item.getQuantity());

            ProductVariant variant = productVariantRepository.findById(item.getProductVariantId()).orElse(null);
            if (variant != null) {
                itemResponse.setVariantName(variant.getName());
                if (variant.getProduct() != null) {
                    itemResponse.setProductName(variant.getProduct().getName());
                    
                    // Get first product image
                    List<ProductImage> images = productImageRepository.findByProductId(variant.getProduct().getId());
                    if (!images.isEmpty()) {
                        itemResponse.setImageUrl(images.get(0).getImageUrl());
                    }
                }
                BigDecimal price = variant.getSalePrice() != null ? variant.getSalePrice() : variant.getPrice();
                itemResponse.setPrice(price);
                itemResponse.setSubtotal(price.multiply(BigDecimal.valueOf(item.getQuantity())));
            }

            return itemResponse;
        }).collect(Collectors.toList());

        totalAmount = itemResponses.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        response.setCartItems(itemResponses);
        response.setTotalAmount(totalAmount);

        return response;
    }

    /**
     * Merge guest cart items into user cart after login
     */
    @Transactional
    public CartResponse mergeGuestCart(Integer userId, MergeCartRequest request) {
        if (request.getGuestCartItems() == null || request.getGuestCartItems().isEmpty()) {
            return getCartByUserId(userId);
        }

        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createCartForUser(userId));

        for (MergeCartRequest.CartItemData guestItem : request.getGuestCartItems()) {
            try {
                ProductVariant variant = productVariantRepository.findById(guestItem.getProductVariantId())
                        .orElseThrow(() -> new RuntimeException("Product variant not found"));

                Optional<CartItem> existingItem = cartItemRepository
                        .findByCartIdAndProductVariantId(cart.getId(), guestItem.getProductVariantId());

                if (existingItem.isPresent()) {
                    CartItem item = existingItem.get();
                    int newQuantity = Math.min(item.getQuantity() + guestItem.getQuantity(), variant.getStockQuantity());
                    item.setQuantity(newQuantity);
                    cartItemRepository.save(item);
                } else {
                    int quantity = Math.min(guestItem.getQuantity(), variant.getStockQuantity());
                    if (quantity > 0) {
                        CartItem newItem = new CartItem();
                        newItem.setCartId(cart.getId());
                        newItem.setProductVariantId(guestItem.getProductVariantId());
                        newItem.setQuantity(quantity);
                        cartItemRepository.save(newItem);
                    }
                }
            } catch (Exception e) {
                System.err.println("Error merging cart item: " + e.getMessage());
            }
        }

        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
        return convertToCartResponse(cart);
    }
}
