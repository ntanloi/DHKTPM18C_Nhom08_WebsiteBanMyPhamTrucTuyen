package iuh.fit.backend.service;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import iuh.fit.backend.config.VNPayConfig;
import iuh.fit.backend.dto.VNPayRequest;
import iuh.fit.backend.dto.VNPayResponse;
import iuh.fit.backend.model.Order;
import iuh.fit.backend.model.Payment;
import iuh.fit.backend.repository.OrderRepository;
import iuh.fit.backend.repository.PaymentRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class VNPayService {
    private final VNPayConfig vnpayConfig;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final NotificationService notificationService;

    private static final Integer VALID_MINUTE = 15;

    /**
     * Generate VNPay payment URL
     */
    public VNPayResponse createPaymentUrl(VNPayRequest request, HttpServletRequest httpServletRequest) {
        try {
            String vnp_TxnRef = vnpayConfig.getRandomNumber(8);
            String vnp_IpAddr = getClientIP(httpServletRequest);

            // Amount must mul 100 (VNPay's request)
            long amount = request.getAmount().multiply(BigDecimal.valueOf(100)).longValue();

            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", vnpayConfig.getVersion());
            vnp_Params.put("vnp_Command", vnpayConfig.getCommand());
            vnp_Params.put("vnp_TmnCode", vnpayConfig.getTmnCode());
            vnp_Params.put("vnp_Amount", String.valueOf(amount));
            vnp_Params.put("vnp_CurrCode", "VND");
            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.put("vnp_OrderInfo", request.getOrderInfo());
            vnp_Params.put("vnp_OrderType", vnpayConfig.getOrderType());
            vnp_Params.put("vnp_Locale", request.getLanguage());
            vnp_Params.put("vnp_ReturnUrl", vnpayConfig.getReturnUrl());
            vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

            // Force a specific payment method to avoid the generic option list on VNPay
            String bankCode = (request.getBankCode() != null && !request.getBankCode().isBlank())
                    ? request.getBankCode().trim()
                    : "NCB"; // default to NCB test card form for sandbox testing
            vnp_Params.put("vnp_BankCode", bankCode);

            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnp_CreateDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

            cld.add(Calendar.MINUTE, VALID_MINUTE);
            String vnp_ExpireDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

            // Build data to hash and query string
            String queryUrl = vnpayConfig.hashAllFields(vnp_Params);
            String vnp_SecureHash = vnpayConfig.hmacSHA512(vnpayConfig.getHashSecret(), queryUrl);
            queryUrl += "&vnp_SecureHashType=SHA512&vnp_SecureHash=" + vnp_SecureHash;

            String paymentUrl = vnpayConfig.getPayUrl() + "?" + queryUrl;

            // Store transaction code in Payment entity
            paymentRepository.findByOrderId(request.getOrderId()).ifPresent(payment -> {
                payment.setTransactionCode(vnp_TxnRef);
                payment.setStatus("PROCESSING");
                payment.setUpdatedAt(LocalDateTime.now());
                paymentRepository.save(payment);
            });

            log.info("Created VNPay payment URL for order: {}, txnRef: {}", request.getOrderId(), vnp_TxnRef);

            return VNPayResponse.builder()
                    .paymentUrl(paymentUrl)
                    .transactionNo(vnp_TxnRef)
                    .orderId(String.valueOf(request.getOrderId()))
                    .success(true)
                    .message("Payment URL created successfully")
                    .build();

        } catch (Exception e) {
            log.error("Error creating VNPay payment URL: {}", e.getMessage());
            return VNPayResponse.builder()
                    .success(false)
                    .message("Error creating payment URL: " + e.getMessage())
                    .build();
        }
    }


    /**
     * Handle VNPay payment return
     */
    @Transactional
    public VNPayResponse processCallback(Map<String, String> params) {
        try {
            String vnp_SecureHash = params.get("vnp_SecureHash");

            // Remove secure hash from params to validate
            params.remove("vnp_SecureHash");
            params.remove("vnp_SecureHashType");

            // Verify signature
            String signValue = vnpayConfig.hashAllFields(params);
            String checkSum = vnpayConfig.hmacSHA512(vnpayConfig.getHashSecret(), signValue);

            if (!checkSum.equalsIgnoreCase(vnp_SecureHash)) {
                log.warn("Invalid VNPay signature for transaction: {}", params.get("vnp_TxnRef"));
                return VNPayResponse.builder()
                        .success(false)
                        .message("Invalid signature")
                        .build();
            }

            String txnRef = params.get("vnp_TxnRef");
            String responseCode = params.get("vnp_ResponseCode");
            String transactionStatus = params.get("vnp_TransactionStatus");
            String bankTranNo = params.get("vnp_BankTranNo");

            // Find payment by transaction code
            Payment payment = paymentRepository.findByTransactionCode(txnRef)
                    .orElseThrow(() -> new RuntimeException("Payment not found for transaction: " + txnRef));

        
            if ("00".equals(responseCode) && "00".equals(transactionStatus)) {
                // Payment successful
                payment.setStatus("COMPLETED");
                payment.setPaidAt(LocalDateTime.now());
                payment.setUpdatedAt(LocalDateTime.now());
                paymentRepository.save(payment);

                // Send notification to customer
                try {
                    Order order = orderRepository.findById(payment.getOrderId())
                            .orElseThrow(() -> new RuntimeException("Order not found"));
                    notificationService.notifyPaymentCompleted(payment.getOrderId(), order.getUserId());
                } catch (Exception e) {
                    log.warn("Failed to send payment notification: {}", e.getMessage());
                }
                
                log.info("Payment completed for order: {}, txnRef: {}", payment.getOrderId(), txnRef);
                
                return VNPayResponse.builder()
                        .success(true)
                        .transactionNo(bankTranNo)
                        .orderId(String.valueOf(payment.getOrderId()))
                        .message("Payment successful")
                        .build();

            } else {
                // Payment failed
                payment.setStatus("FAILED");
                payment.setUpdatedAt(LocalDateTime.now());
                paymentRepository.save(payment);

                log.info("Payment failed for order: {}, txnRef: {}", payment.getOrderId(), txnRef);

                return VNPayResponse.builder()
                        .success(false)
                        .transactionNo(bankTranNo)
                        .orderId(String.valueOf(payment.getOrderId()))
                        .message("Payment failed with response code: " + responseCode)
                        .build();
            }



        } catch (Exception e) {
            log.error("Error processing VNPay callback: {}", e.getMessage());
            return VNPayResponse.builder()
                    .success(false)
                    .message("Error processing payment callback: " + e.getMessage())
                    .build();
        }
    }


    /**
     * Get client IP address
     */
    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
