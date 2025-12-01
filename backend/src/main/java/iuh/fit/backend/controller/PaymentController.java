package iuh.fit.backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import iuh.fit.backend.dto.VNPayRequest;
import iuh.fit.backend.dto.VNPayResponse;
import iuh.fit.backend.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final VNPayService vnPayService;

    /**
     * Create URL for VNPay payment
     */
    @PostMapping("/vnpay/create")
    public ResponseEntity<VNPayResponse> createVNPayPayment(@RequestBody VNPayRequest request,
                                                            HttpServletRequest httpRequest) {
        VNPayResponse response = vnPayService.createPaymentUrl(request, httpRequest);
        return ResponseEntity.ok(response);
    }

    /**
     * Callback URL after payment on VNPay (GET request from VNPay redirect)
     */
    @GetMapping("/vnpay/callback")
    public ResponseEntity<VNPayResponse> handleVNPayCallback(@RequestParam Map<String, String> params) {
        VNPayResponse response = vnPayService.processCallback(params);
        return ResponseEntity.ok(response);
    }

    /**
     * IPN URL for VNPay to notify payment result
     */
    @PostMapping("/vnpay/ipn")
    public ResponseEntity<Map<String, String>> vnpayIPN(@RequestParam Map<String, String> params) {
        VNPayResponse response = vnPayService.processCallback(params);

        if(response.isSuccess()) {
           return ResponseEntity.ok(Map.of("RspCode", "00", "Message", "Confirm Success"));
        } else {
            return ResponseEntity.ok(Map.of("RspCode", "99", "Message", response.getMessage()));
        }
    }

}
