package iuh.fit.backend.service;

import iuh.fit.backend.dto.PaymentMethodResponse;
import iuh.fit.backend.model.PaymentMethod;
import iuh.fit.backend.repository.PaymentMethodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentMethodService {
    
    private final PaymentMethodRepository paymentMethodRepository;
    
    public List<PaymentMethodResponse> getAllActivePaymentMethods() {
        return paymentMethodRepository.findByIsActiveTrue()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<PaymentMethodResponse> getAllPaymentMethods() {
        return paymentMethodRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public PaymentMethodResponse getPaymentMethodById(Integer id) {
        PaymentMethod paymentMethod = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment method not found with id: " + id));
        return convertToResponse(paymentMethod);
    }
    
    public PaymentMethodResponse getPaymentMethodByCode(String code) {
        PaymentMethod paymentMethod = paymentMethodRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Payment method not found with code: " + code));
        return convertToResponse(paymentMethod);
    }
    
    private PaymentMethodResponse convertToResponse(PaymentMethod paymentMethod) {
        return PaymentMethodResponse.builder()
                .id(paymentMethod.getId())
                .name(paymentMethod.getName())
                .code(paymentMethod.getCode())
                .description(null) // Not available in entity
                .icon(null) // Not available in entity
                .isActive(paymentMethod.getIsActive())
                .build();
    }
}
