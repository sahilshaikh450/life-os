package com.lifeos.repository;

import com.lifeos.entity.Budget;
import com.lifeos.entity.Expense;
import com.lifeos.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUserAndMonthAndYear(User user, int month, int year);
    Optional<Budget> findByUserAndCategoryAndMonthAndYear(User user, Expense.Category category, int month, int year);
    Optional<Budget> findByIdAndUser(Long id, User user);
    List<Budget> findByUser(User user);
}
