package com.payment.payment_service.controller;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


public class PaymentSuccessController {
    @GetMapping("/paymentGateway/success")
    public String paymentSuccess(@RequestParam("session_id") String sessionId, Model model) {
        model.addAttribute("message", "Payment was successful!");
        model.addAttribute("sessionId", sessionId);
        return "success"; // this should map to success.html
    }
}
