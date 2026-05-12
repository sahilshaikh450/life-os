package com.lifeos.repository;

import com.lifeos.entity.Todo;
import com.lifeos.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByUserAndParentIsNullOrderByOrderIndexAscCreatedAtDesc(User user);
    Optional<Todo> findByIdAndUser(Long id, User user);
    List<Todo> findByUserAndStatus(User user, Todo.Status status);
    List<Todo> findByUserAndPriority(User user, Todo.Priority priority);
    List<Todo> findByUserAndDueDateAndParentIsNull(User user, LocalDate dueDate);

    @Query("SELECT t FROM Todo t WHERE t.user = :user AND t.dueDate <= :date AND t.completed = false")
    List<Todo> findOverdueTasks(@Param("user") User user, @Param("date") LocalDate date);

    @Query("SELECT COUNT(t) FROM Todo t WHERE t.user = :user AND t.completed = true")
    long countCompletedByUser(@Param("user") User user);

    @Query("SELECT COUNT(t) FROM Todo t WHERE t.user = :user AND t.completed = false")
    long countPendingByUser(@Param("user") User user);

    List<Todo> findByUserAndProjectId(User user, Long projectId);
}
