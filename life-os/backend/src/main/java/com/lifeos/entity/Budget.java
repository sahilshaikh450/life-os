package com.lifeos.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "budgets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "budget_category")
    private Expense.Category category;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal limitAmount;

    @Column(precision = 12, scale = 2)
    private BigDecimal spentAmount = BigDecimal.ZERO;

    @Column(name = "budget_month")
    private int month;

    @Column(name = "budget_year")
    private int year;

    private LocalDate periodStart;
    private LocalDate periodEnd;

    private String color;
    private String icon;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (spentAmount == null) spentAmount = BigDecimal.ZERO;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}