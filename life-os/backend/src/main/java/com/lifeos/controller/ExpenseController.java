package com.lifeos.controller;

import com.lifeos.dto.ExpenseDto;
import com.lifeos.entity.User;
import com.lifeos.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseDto.Response> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ExpenseDto.CreateRequest request) {

        return ResponseEntity.ok(
                expenseService.createExpense(user, request)
        );
    }

    @GetMapping
    public ResponseEntity<List<ExpenseDto.Response>> getAll(
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(
                expenseService.getAllExpenses(user)
        );
    }

    @GetMapping("/range")
    public ResponseEntity<List<ExpenseDto.Response>> getByRange(
            @AuthenticationPrincipal User user,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate start,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate end) {

        return ResponseEntity.ok(
                expenseService.getExpensesByDateRange(user, start, end)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseDto.Response> update(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody ExpenseDto.CreateRequest request) {

        return ResponseEntity.ok(
                expenseService.updateExpense(user, id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        expenseService.deleteExpense(user, id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<ExpenseDto.StatsResponse> getStats(
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(
                expenseService.getStats(user)
        );
    }

    // Budget APIs

    @PostMapping("/budgets")
    public ResponseEntity<ExpenseDto.BudgetResponse> createBudget(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ExpenseDto.BudgetRequest request) {

        return ResponseEntity.ok(
                expenseService.createBudget(user, request)
        );
    }

    @GetMapping("/budgets")
    public ResponseEntity<List<ExpenseDto.BudgetResponse>> getBudgets(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int month,
            @RequestParam(defaultValue = "0") int year) {

        if (month == 0) {
            month = LocalDate.now().getMonthValue();
        }

        if (year == 0) {
            year = LocalDate.now().getYear();
        }

        return ResponseEntity.ok(
                expenseService.getBudgets(user, month, year)
        );
    }

    @DeleteMapping("/budgets/{id}")
    public ResponseEntity<Void> deleteBudget(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        expenseService.deleteBudget(user, id);

        return ResponseEntity.noContent().build();
    }
}