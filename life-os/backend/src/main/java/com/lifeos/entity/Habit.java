package com.lifeos.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "habits")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Habit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    private String description;

    private String icon;

    private String color;

    @Enumerated(EnumType.STRING)
    private Frequency frequency;

    @Enumerated(EnumType.STRING)
    private Category category;

    private Integer targetDays;

    private Integer currentStreak;

    private Integer longestStreak;

    private Integer totalCompletions;

    private LocalDate startDate;

    private LocalDate endDate;

    private boolean active = true;

    private boolean archived = false;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "habit", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<HabitLog> logs = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (currentStreak == null) currentStreak = 0;
        if (longestStreak == null) longestStreak = 0;
        if (totalCompletions == null) totalCompletions = 0;
        if (startDate == null) startDate = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum Frequency {
        DAILY, WEEKLY, MONTHLY
    }

    public enum Category {
        HEALTH, FITNESS, MINDFULNESS, LEARNING, PRODUCTIVITY, SOCIAL, FINANCE, CREATIVITY, OTHER
    }
}
