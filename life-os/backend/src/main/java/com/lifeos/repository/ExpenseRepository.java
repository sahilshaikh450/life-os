package com.lifeos.repository;

import com.lifeos.entity.Expense;
import com.lifeos.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserOrderByExpenseDateDescCreatedAtDesc(User user);
    Optional<Expense> findByIdAndUser(Long id, User user);

    List<Expense> findByUserAndExpenseDateBetweenOrderByExpenseDateDesc(
        User user, LocalDate start, LocalDate end
    );

    List<Expense> findByUserAndCategory(User user, Expense.Category category);
    List<Expense> findByUserAndType(User user, Expense.Type type);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user = :user AND e.type = :type AND e.expenseDate BETWEEN :start AND :end")
    BigDecimal sumByUserAndTypeAndDateRange(
        @Param("user") User user,
        @Param("type") Expense.Type type,
        @Param("start") LocalDate start,
        @Param("end") LocalDate end
    );

    @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE e.user = :user AND e.type = 'EXPENSE' AND e.expenseDate BETWEEN :start AND :end GROUP BY e.category")
    List<Object[]> getCategoryWiseExpenses(@Param("user") User user, @Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT FUNCTION('MONTH', e.expenseDate), FUNCTION('YEAR', e.expenseDate), SUM(e.amount) FROM Expense e WHERE e.user = :user AND e.type = :type GROUP BY FUNCTION('MONTH', e.expenseDate), FUNCTION('YEAR', e.expenseDate) ORDER BY FUNCTION('YEAR', e.expenseDate), FUNCTION('MONTH', e.expenseDate)")
    List<Object[]> getMonthlyTotals(@Param("user") User user, @Param("type") Expense.Type type);
}
