package com.lifeos.repository;

import com.lifeos.entity.Habit;
import com.lifeos.entity.HabitLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface HabitLogRepository extends JpaRepository<HabitLog, Long> {
    Optional<HabitLog> findByHabitAndLogDate(Habit habit, LocalDate logDate);
    List<HabitLog> findByHabitAndLogDateBetweenOrderByLogDateDesc(Habit habit, LocalDate start, LocalDate end);

    @Query("SELECT hl FROM HabitLog hl WHERE hl.habit.user.id = :userId AND hl.logDate = :date")
    List<HabitLog> findByUserIdAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);

    @Query("SELECT hl FROM HabitLog hl WHERE hl.habit.user.id = :userId AND hl.logDate BETWEEN :start AND :end")
    List<HabitLog> findByUserIdAndDateRange(
        @Param("userId") Long userId,
        @Param("start") LocalDate start,
        @Param("end") LocalDate end
    );

    @Query("SELECT COUNT(hl) FROM HabitLog hl WHERE hl.habit = :habit AND hl.completed = true")
    long countCompletedByHabit(@Param("habit") Habit habit);
}
