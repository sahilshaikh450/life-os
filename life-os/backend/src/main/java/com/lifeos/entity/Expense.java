package com.lifeos.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "expenses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    private Category category;

    @Enumerated(EnumType.STRING)
    private Type type; // INCOME or EXPENSE

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    private String tags;

    private LocalDate expenseDate;

    private boolean recurring;

    @Enumerated(EnumType.STRING)
    private RecurringFrequency recurringFrequency;

    private String currency = "INR";

    private String receiptUrl;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (expenseDate == null) expenseDate = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum Category {
        FOOD, TRANSPORT, HOUSING, HEALTHCARE, ENTERTAINMENT, SHOPPING, EDUCATION,
        UTILITIES, SAVINGS, INVESTMENT, SALARY, FREELANCE, BUSINESS, GIFT, OTHER
    }

    public enum Type {
        INCOME, EXPENSE
    }

    public enum PaymentMethod {
        CASH, CREDIT_CARD, DEBIT_CARD, UPI, NET_BANKING, WALLET, OTHER
    }

    public enum RecurringFrequency {
        DAILY, WEEKLY, MONTHLY, YEARLY
    }
}
