package com.lifeos.repository;

import com.lifeos.entity.Habit;
import com.lifeos.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface HabitRepository extends JpaRepository<Habit, Long> {
    List<Habit> findByUserAndArchivedFalseOrderByCreatedAtDesc(User user);
    List<Habit> findByUserAndArchivedFalseAndActiveTrue(User user);
    Optional<Habit> findByIdAndUser(Long id, User user);

    @Query("SELECT h FROM Habit h WHERE h.user = :user AND h.archived = false AND h.category = :category")
    List<Habit> findByUserAndCategory(@Param("user") User user, @Param("category") Habit.Category category);

    @Query("SELECT COUNT(h) FROM Habit h WHERE h.user = :user AND h.archived = false")
    long countByUser(@Param("user") User user);
}
