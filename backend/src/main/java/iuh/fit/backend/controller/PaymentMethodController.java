package iuh.fit.backend.controller;

import iuh.fit.backend.dto.PaymentMethodResponse;
import iuh.fit.backend.service.PaymentMethodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentMethodController {
    
    private final PaymentMethodService paymentMethodService;
    
    /**
     * Get all active payment methods (public endpoint)
     */
    @GetMapping
    public ResponseEntity<List<PaymentMethodResponse>> getAllActivePaymentMethods() {
        List<PaymentMethodResponse> paymentMethods = paymentMethodService.getAllActivePaymentMethods();
        return ResponseEntity.ok(paymentMethods);
    }
    
    /**
     * Get all payment methods including inactive (admin only)
     */
    @GetMapping("/all")
    public ResponseEntity<List<PaymentMethodResponse>> getAllPaymentMethods() {
        List<PaymentMethodResponse> paymentMethods = paymentMethodService.getAllPaymentMethods();
        return ResponseEntity.ok(paymentMethods);
    }
    
    /**
     * Get payment method by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<PaymentMethodResponse> getPaymentMethodById(@PathVariable Integer id) {
        PaymentMethodResponse paymentMethod = paymentMethodService.getPaymentMethodById(id);
        return ResponseEntity.ok(paymentMethod);
    }
    
    /**
     * Get payment method by code
     */
    @GetMapping("/code/{code}")
    public ResponseEntity<PaymentMethodResponse> getPaymentMethodByCode(@PathVariable String code) {
        PaymentMethodResponse paymentMethod = paymentMethodService.getPaymentMethodByCode(code);
        return ResponseEntity.ok(paymentMethod);
    }
}
