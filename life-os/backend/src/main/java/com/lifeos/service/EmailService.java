package com.lifeos.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@Slf4j
public class EmailService {

    @Value("${sendgrid.api.key}")
    private String sendgridApiKey;

    @Value("${sendgrid.from.email}")
    private String fromEmail;

    private void sendEmail(String toEmail, String subject, String htmlContent) {
        try {
            Email from = new Email(fromEmail, "Life OS");
            Email to = new Email(toEmail);
            Content content = new Content("text/html", htmlContent);
            Mail mail = new Mail(from, subject, to, content);

            SendGrid sg = new SendGrid(sendgridApiKey);
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);
            log.info("Email sent to {} - Status: {}", toEmail, response.getStatusCode());
        } catch (IOException e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendOtpEmail(String toEmail, String otp) {
        String html = "<!DOCTYPE html><html><body style='margin:0;padding:0;background:#070714;font-family:Arial,sans-serif'>" +
            "<div style='max-width:500px;margin:40px auto;padding:32px;background:#0d0d1f;border:1px solid rgba(167,139,250,0.2);border-radius:20px;text-align:center'>" +
            "<h1 style='color:#f1f5f9;margin-bottom:8px'>⚡ Life OS</h1>" +
            "<h2 style='color:#a78bfa;margin-bottom:16px'>Verify Your Email</h2>" +
            "<p style='color:#9ca3af;margin-bottom:24px'>Your OTP code is:</p>" +
            "<div style='font-size:48px;font-weight:800;color:#f1f5f9;letter-spacing:16px;margin:24px 0;background:rgba(167,139,250,0.1);padding:20px;border-radius:12px'>" + otp + "</div>" +
            "<p style='color:#6b7280;font-size:13px'>Valid for 5 minutes. Do not share this code.</p>" +
            "<p style='color:#4b5563;font-size:12px;margin-top:24px'>© 2025 Life OS</p>" +
            "</div></body></html>";
        sendEmail(toEmail, "🔐 Your Life OS OTP: " + otp, html);
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String firstName) {
        String html = "<!DOCTYPE html><html><body style='margin:0;padding:0;background:#070714;font-family:Arial,sans-serif'>" +
            "<div style='max-width:600px;margin:40px auto;padding:32px'>" +
            "<div style='text-align:center;margin-bottom:32px'>" +
            "<h1 style='color:#f1f5f9;font-size:28px;margin:16px 0 4px'>⚡ Life OS</h1>" +
            "<p style='color:#6b7280;margin:0'>Your Personal Productivity Universe</p></div>" +
            "<div style='background:#0d0d1f;border:1px solid rgba(167,139,250,0.2);border-radius:20px;padding:32px'>" +
            "<h2 style='color:#f1f5f9;font-size:24px;margin:0 0 16px'>Welcome, " + firstName + "! 🎉</h2>" +
            "<p style='color:#9ca3af;line-height:1.6;margin:0 0 24px'>Your Life OS account is ready!</p>" +
            "<p style='color:#9ca3af'>💪 Habit Forge - Track daily habits</p>" +
            "<p style='color:#9ca3af'>💰 Wealth Map - Monitor expenses</p>" +
            "<p style='color:#9ca3af'>✅ Task Engine - Manage tasks</p>" +
            "</div>" +
            "<p style='color:#4b5563;text-align:center;margin-top:24px;font-size:12px'>© 2025 Life OS</p>" +
            "</div></body></html>";
        sendEmail(toEmail, "⚡ Welcome to Life OS, " + firstName + "!", html);
    }

    @Async
    public void sendLoginEmail(String toEmail, String firstName) {
        String time = new java.util.Date().toString();
        String html = "<!DOCTYPE html><html><body style='margin:0;padding:0;background:#070714;font-family:Arial,sans-serif'>" +
            "<div style='max-width:600px;margin:40px auto;padding:32px'>" +
            "<h1 style='color:#f1f5f9;text-align:center'>⚡ Life OS</h1>" +
            "<div style='background:#0d0d1f;border:1px solid rgba(167,139,250,0.2);border-radius:20px;padding:32px'>" +
            "<h2 style='color:#f1f5f9'>🔐 New Login Detected</h2>" +
            "<p style='color:#9ca3af'>Hi " + firstName + ", a new login was detected.</p>" +
            "<p style='color:#6b7280'>Time: " + time + "</p>" +
            "<p style='color:#9ca3af;font-size:14px'>If this was you, no action needed.</p>" +
            "</div>" +
            "<p style='color:#4b5563;text-align:center;margin-top:24px;font-size:12px'>© 2025 Life OS</p>" +
            "</div></body></html>";
        sendEmail(toEmail, "🔐 New Login Detected - Life OS", html);
    }

    @Async
    public void sendHabitCompleteEmail(String toEmail, String firstName, String habitName, int streak) {
        String html = "<!DOCTYPE html><html><body style='margin:0;padding:0;background:#070714;font-family:Arial,sans-serif'>" +
            "<div style='max-width:600px;margin:40px auto;padding:32px'>" +
            "<h1 style='color:#f1f5f9;text-align:center'>⚡ Life OS</h1>" +
            "<div style='background:#0d0d1f;border:1px solid rgba(52,211,153,0.3);border-radius:20px;padding:32px;text-align:center'>" +
            "<div style='font-size:64px'>🔥</div>" +
            "<h2 style='color:#34d399'>Streak: " + streak + " Days!</h2>" +
            "<p style='color:#f1f5f9'>Great job, " + firstName + "!</p>" +
            "<p style='color:#9ca3af'>You completed <strong>" + habitName + "</strong> today.</p>" +
            "</div>" +
            "<p style='color:#4b5563;text-align:center;margin-top:24px;font-size:12px'>© 2025 Life OS</p>" +
            "</div></body></html>";
        sendEmail(toEmail, "🔥 Habit Completed! " + streak + " Day Streak - " + habitName, html);
    }

    @Async
    public void sendTaskCompleteEmail(String toEmail, String firstName, String taskTitle) {
        String html = "<!DOCTYPE html><html><body style='margin:0;padding:0;background:#070714;font-family:Arial,sans-serif'>" +
            "<div style='max-width:600px;margin:40px auto;padding:32px'>" +
            "<h1 style='color:#f1f5f9;text-align:center'>⚡ Life OS</h1>" +
            "<div style='background:#0d0d1f;border:1px solid rgba(59,130,246,0.3);border-radius:20px;padding:32px;text-align:center'>" +
            "<div style='font-size:64px'>✅</div>" +
            "<h2 style='color:#60a5fa'>Task Completed!</h2>" +
            "<p style='color:#f1f5f9'>Well done, " + firstName + "!</p>" +
            "<p style='color:#9ca3af'>\"" + taskTitle + "\"</p>" +
            "</div>" +
            "<p style='color:#4b5563;text-align:center;margin-top:24px;font-size:12px'>© 2025 Life OS</p>" +
            "</div></body></html>";
        sendEmail(toEmail, "✅ Task Completed! - " + taskTitle, html);
    }

    @Async
    public void sendPendingReminderEmail(String toEmail, String firstName, int pendingTasks, int pendingHabits) {
        String html = "<!DOCTYPE html><html><body style='margin:0;padding:0;background:#070714;font-family:Arial,sans-serif'>" +
            "<div style='max-width:600px;margin:40px auto;padding:32px'>" +
            "<h1 style='color:#f1f5f9;text-align:center'>⚡ Life OS</h1>" +
            "<div style='background:#0d0d1f;border:1px solid rgba(245,158,11,0.3);border-radius:20px;padding:32px'>" +
            "<h2 style='color:#f59e0b'>⏰ Daily Reminder</h2>" +
            "<p style='color:#f1f5f9'>Hey " + firstName + "!</p>" +
            "<p style='color:#9ca3af'>📋 Pending Tasks: " + pendingTasks + "</p>" +
            "<p style='color:#9ca3af'>💪 Pending Habits: " + pendingHabits + "</p>" +
            "<p style='color:#9ca3af'>Don't let today slip away! 🚀</p>" +
            "</div>" +
            "<p style='color:#4b5563;text-align:center;margin-top:24px;font-size:12px'>© 2025 Life OS</p>" +
            "</div></body></html>";
        sendEmail(toEmail, "⏰ Daily Reminder - " + (pendingTasks + pendingHabits) + " things pending!", html);
    }
}
