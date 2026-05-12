package com.lifeos.dto;

import com.lifeos.entity.Expense;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class ExpenseDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotNull @Positive
        private BigDecimal amount;
        @NotBlank
        private String title;
        private String description;
        private Expense.Category category;
        @NotNull
        private Expense.Type type;
        private Expense.PaymentMethod paymentMethod;
        private String tags;
        private LocalDate expenseDate;
        private boolean recurring;
        private Expense.RecurringFrequency recurringFrequency;
        private String currency;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private BigDecimal amount;
        private String title;
        private String description;
        private Expense.Category category;
        private Expense.Type type;
        private Expense.PaymentMethod paymentMethod;
        private String tags;
        private LocalDate expenseDate;
        private boolean recurring;
        private Expense.RecurringFrequency recurringFrequency;
        private String currency;
        private LocalDateTime createdAt;

        public static Response from(Expense e) {
            return Response.builder()
                .id(e.getId()).amount(e.getAmount()).title(e.getTitle())
                .description(e.getDescription()).category(e.getCategory())
                .type(e.getType()).paymentMethod(e.getPaymentMethod())
                .tags(e.getTags()).expenseDate(e.getExpenseDate())
                .recurring(e.isRecurring()).recurringFrequency(e.getRecurringFrequency())
                .currency(e.getCurrency()).createdAt(e.getCreatedAt())
                .build();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatsResponse {
        private BigDecimal totalIncome;
        private BigDecimal totalExpenses;
        private BigDecimal netBalance;
        private BigDecimal savingsRate;
        private Map<String, BigDecimal> categoryBreakdown;
        private List<MonthlyData> monthlyTrend;
        private List<BudgetStatus> budgetStatuses;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyData {
        private int month;
        private int year;
        private BigDecimal income;
        private BigDecimal expenses;
        private BigDecimal net;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BudgetStatus {
        private Long budgetId;
        private Expense.Category category;
        private BigDecimal limit;
        private BigDecimal spent;
        private BigDecimal remaining;
        private double percentUsed;
        private String color;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BudgetRequest {
        @NotNull
        private Expense.Category category;
        @NotNull @Positive
        private BigDecimal limitAmount;
        private int month;
        private int year;
        private String color;
        private String icon;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BudgetResponse {
        private Long id;
        private Expense.Category category;
        private BigDecimal limitAmount;
        private BigDecimal spentAmount;
        private int month;
        private int year;
        private String color;
        private String icon;
        private double percentUsed;
    }
}
