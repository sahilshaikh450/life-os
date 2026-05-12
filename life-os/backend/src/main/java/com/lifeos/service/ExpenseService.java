package com.lifeos.service;

import com.lifeos.dto.ExpenseDto;
import com.lifeos.entity.Budget;
import com.lifeos.entity.Expense;
import com.lifeos.entity.User;
import com.lifeos.repository.BudgetRepository;
import com.lifeos.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;

    public ExpenseDto.Response createExpense(User user, ExpenseDto.CreateRequest request) {
        var expense = Expense.builder()
            .user(user).amount(request.getAmount()).title(request.getTitle())
            .description(request.getDescription()).category(request.getCategory())
            .type(request.getType()).paymentMethod(request.getPaymentMethod())
            .tags(request.getTags()).expenseDate(request.getExpenseDate())
            .recurring(request.isRecurring()).recurringFrequency(request.getRecurringFrequency())
            .currency(request.getCurrency() != null ? request.getCurrency() : "INR")
            .build();

        expense = expenseRepository.save(expense);
        updateBudgetSpending(user, expense);
        return ExpenseDto.Response.from(expense);
    }

    public List<ExpenseDto.Response> getAllExpenses(User user) {
        return expenseRepository.findByUserOrderByExpenseDateDescCreatedAtDesc(user)
            .stream().map(ExpenseDto.Response::from).collect(Collectors.toList());
    }

    public List<ExpenseDto.Response> getExpensesByDateRange(User user, LocalDate start, LocalDate end) {
        return expenseRepository.findByUserAndExpenseDateBetweenOrderByExpenseDateDesc(user, start, end)
            .stream().map(ExpenseDto.Response::from).collect(Collectors.toList());
    }

    public ExpenseDto.Response updateExpense(User user, Long id, ExpenseDto.CreateRequest request) {
        var expense = expenseRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new RuntimeException("Expense not found"));

        expense.setAmount(request.getAmount());
        expense.setTitle(request.getTitle());
        expense.setDescription(request.getDescription());
        expense.setCategory(request.getCategory());
        expense.setType(request.getType());
        expense.setPaymentMethod(request.getPaymentMethod());
        expense.setTags(request.getTags());
        expense.setExpenseDate(request.getExpenseDate());

        expense = expenseRepository.save(expense);
        return ExpenseDto.Response.from(expense);
    }

    public void deleteExpense(User user, Long id) {
        var expense = expenseRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new RuntimeException("Expense not found"));
        expenseRepository.delete(expense);
    }

    public ExpenseDto.StatsResponse getStats(User user) {
        LocalDate now = LocalDate.now();
        LocalDate monthStart = now.withDayOfMonth(1);
        LocalDate monthEnd = now.withDayOfMonth(now.lengthOfMonth());

        BigDecimal totalIncome = Optional.ofNullable(
            expenseRepository.sumByUserAndTypeAndDateRange(user, Expense.Type.INCOME, monthStart, monthEnd)
        ).orElse(BigDecimal.ZERO);

        BigDecimal totalExpenses = Optional.ofNullable(
            expenseRepository.sumByUserAndTypeAndDateRange(user, Expense.Type.EXPENSE, monthStart, monthEnd)
        ).orElse(BigDecimal.ZERO);

        BigDecimal netBalance = totalIncome.subtract(totalExpenses);

        BigDecimal savingsRate = totalIncome.compareTo(BigDecimal.ZERO) > 0
            ? netBalance.divide(totalIncome, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100))
            : BigDecimal.ZERO;

        // Category breakdown
        Map<String, BigDecimal> categoryBreakdown = new LinkedHashMap<>();
        expenseRepository.getCategoryWiseExpenses(user, monthStart, monthEnd).forEach(row -> {
            categoryBreakdown.put(row[0].toString(), (BigDecimal) row[1]);
        });

        // Monthly trend (last 6 months)
        List<ExpenseDto.MonthlyData> monthlyTrend = buildMonthlyTrend(user);

        // Budget statuses
        List<ExpenseDto.BudgetStatus> budgetStatuses = getBudgetStatuses(user, now.getMonthValue(), now.getYear());

        return ExpenseDto.StatsResponse.builder()
            .totalIncome(totalIncome).totalExpenses(totalExpenses)
            .netBalance(netBalance).savingsRate(savingsRate)
            .categoryBreakdown(categoryBreakdown)
            .monthlyTrend(monthlyTrend).budgetStatuses(budgetStatuses)
            .build();
    }

    public ExpenseDto.BudgetResponse createBudget(User user, ExpenseDto.BudgetRequest request) {
        int month = request.getMonth() > 0 ? request.getMonth() : LocalDate.now().getMonthValue();
        int year = request.getYear() > 0 ? request.getYear() : LocalDate.now().getYear();

        var existing = budgetRepository.findByUserAndCategoryAndMonthAndYear(user, request.getCategory(), month, year);

        Budget budget;
        if (existing.isPresent()) {
            budget = existing.get();
            budget.setLimitAmount(request.getLimitAmount());
            budget.setColor(request.getColor());
            budget.setIcon(request.getIcon());
        } else {
            budget = Budget.builder()
                .user(user).category(request.getCategory()).limitAmount(request.getLimitAmount())
                .month(month).year(year).color(request.getColor()).icon(request.getIcon())
                .spentAmount(BigDecimal.ZERO).build();
        }

        budget = budgetRepository.save(budget);
        return toBudgetResponse(budget);
    }

    public List<ExpenseDto.BudgetResponse> getBudgets(User user, int month, int year) {
        return budgetRepository.findByUserAndMonthAndYear(user, month, year)
            .stream().map(this::toBudgetResponse).collect(Collectors.toList());
    }

    public void deleteBudget(User user, Long id) {
        var budget = budgetRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new RuntimeException("Budget not found"));
        budgetRepository.delete(budget);
    }

    private void updateBudgetSpending(User user, Expense expense) {
        if (expense.getType() != Expense.Type.EXPENSE || expense.getCategory() == null) return;
        LocalDate date = expense.getExpenseDate();
        budgetRepository.findByUserAndCategoryAndMonthAndYear(
            user, expense.getCategory(), date.getMonthValue(), date.getYear()
        ).ifPresent(budget -> {
            budget.setSpentAmount(budget.getSpentAmount().add(expense.getAmount()));
            budgetRepository.save(budget);
        });
    }

    private List<ExpenseDto.MonthlyData> buildMonthlyTrend(User user) {
        List<ExpenseDto.MonthlyData> trend = new ArrayList<>();
        LocalDate now = LocalDate.now();
        for (int i = 5; i >= 0; i--) {
            LocalDate month = now.minusMonths(i);
            LocalDate start = month.withDayOfMonth(1);
            LocalDate end = month.withDayOfMonth(month.lengthOfMonth());
            BigDecimal income = Optional.ofNullable(
                expenseRepository.sumByUserAndTypeAndDateRange(user, Expense.Type.INCOME, start, end)
            ).orElse(BigDecimal.ZERO);
            BigDecimal expenses = Optional.ofNullable(
                expenseRepository.sumByUserAndTypeAndDateRange(user, Expense.Type.EXPENSE, start, end)
            ).orElse(BigDecimal.ZERO);
            trend.add(ExpenseDto.MonthlyData.builder()
                .month(month.getMonthValue()).year(month.getYear())
                .income(income).expenses(expenses).net(income.subtract(expenses))
                .build());
        }
        return trend;
    }

    private List<ExpenseDto.BudgetStatus> getBudgetStatuses(User user, int month, int year) {
        return budgetRepository.findByUserAndMonthAndYear(user, month, year).stream().map(b -> {
            double pct = b.getLimitAmount().compareTo(BigDecimal.ZERO) > 0
                ? b.getSpentAmount().divide(b.getLimitAmount(), 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).doubleValue()
                : 0;
            return ExpenseDto.BudgetStatus.builder()
                .budgetId(b.getId()).category(b.getCategory()).limit(b.getLimitAmount())
                .spent(b.getSpentAmount()).remaining(b.getLimitAmount().subtract(b.getSpentAmount()))
                .percentUsed(pct).color(b.getColor()).build();
        }).collect(Collectors.toList());
    }

    private ExpenseDto.BudgetResponse toBudgetResponse(Budget b) {
        double pct = b.getLimitAmount().compareTo(BigDecimal.ZERO) > 0
            ? b.getSpentAmount().divide(b.getLimitAmount(), 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).doubleValue()
            : 0;
        return ExpenseDto.BudgetResponse.builder()
            .id(b.getId()).category(b.getCategory()).limitAmount(b.getLimitAmount())
            .spentAmount(b.getSpentAmount()).month(b.getMonth()).year(b.getYear())
            .color(b.getColor()).icon(b.getIcon()).percentUsed(pct).build();
    }
}
