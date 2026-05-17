package com.lifeos.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final EmailService emailService;
    private final Map<String, OtpData> otpStore = new ConcurrentHashMap<>();

    public void sendOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStore.put(email, new OtpData(otp, System.currentTimeMillis()));
        emailService.sendOtpEmail(email, otp);
        log.info("OTP sent to {}", email);
    }

    public boolean verifyOtp(String email, String otp) {
        OtpData data = otpStore.get(email);
        if (data == null) return false;
        long elapsed = System.currentTimeMillis() - data.timestamp();
        if (elapsed > 5 * 60 * 1000) {
            otpStore.remove(email);
            return false;
        }
        if (data.otp().equals(otp)) {
            otpStore.remove(email);
            return true;
        }
        return false;
    }

    record OtpData(String otp, long timestamp) {}
}
