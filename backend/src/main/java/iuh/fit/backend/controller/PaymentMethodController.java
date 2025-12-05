package iuh.fit.backend.controller;

import iuh.fit.backend.dto.PaymentMethodResponse;
import iuh.fit.backend.model.PaymentMethod;
import iuh.fit.backend.repository.PaymentMethodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payment-methods")
@RequiredArgsConstructor
public class PaymentMethodController {

    private final PaymentMethodRepository paymentMethodRepository;

    @GetMapping
    public ResponseEntity<List<PaymentMethodResponse>> getActivePaymentMethods() {
        List<PaymentMethod> paymentMethods = paymentMethodRepository.findByIsActiveTrueOrderBySortOrderAsc();

        List<PaymentMethodResponse> response = paymentMethods.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<PaymentMethodResponse>> getAllPaymentMethods() {
        List<PaymentMethod> paymentMethods = paymentMethodRepository.findAll();

        List<PaymentMethodResponse> response = paymentMethods.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{code}")
    public ResponseEntity<PaymentMethodResponse> getPaymentMethodByCode(@PathVariable String code) {
        return paymentMethodRepository.findByCode(code)
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private PaymentMethodResponse toResponse(PaymentMethod paymentMethod) {
        return PaymentMethodResponse.builder()
                .id(paymentMethod.getId())
                .name(paymentMethod.getName())
                .code(paymentMethod.getCode())
                .description(paymentMethod.getDescription())
                .icon(paymentMethod.getIcon())
                .isActive(paymentMethod.getIsActive())
                .isRecommended(paymentMethod.getIsRecommended())
                .sortOrder(paymentMethod.getSortOrder())
                .build();
    }
}
