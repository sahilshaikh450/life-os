package com.lifeos.dto;

import com.lifeos.entity.Habit;
import com.lifeos.entity.HabitLog;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class HabitDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotBlank
        private String name;
        private String description;
        private String icon;
        private String color;
        private Habit.Frequency frequency;
        private Habit.Category category;
        private Integer targetDays;
        private LocalDate startDate;
        private LocalDate endDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private String name;
        private String description;
        private String icon;
        private String color;
        private Habit.Frequency frequency;
        private Habit.Category category;
        private Integer targetDays;
        private LocalDate endDate;
        private Boolean active;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String name;
        private String description;
        private String icon;
        private String color;
        private Habit.Frequency frequency;
        private Habit.Category category;
        private Integer targetDays;
        private Integer currentStreak;
        private Integer longestStreak;
        private Integer totalCompletions;
        private LocalDate startDate;
        private LocalDate endDate;
        private boolean active;
        private boolean archived;
        private boolean completedToday;
        private double completionRate;
        private LocalDateTime createdAt;

        public static Response from(Habit habit, boolean completedToday, double completionRate) {
            return Response.builder()
                .id(habit.getId())
                .name(habit.getName())
                .description(habit.getDescription())
                .icon(habit.getIcon())
                .color(habit.getColor())
                .frequency(habit.getFrequency())
                .category(habit.getCategory())
                .targetDays(habit.getTargetDays())
                .currentStreak(habit.getCurrentStreak())
                .longestStreak(habit.getLongestStreak())
                .totalCompletions(habit.getTotalCompletions())
                .startDate(habit.getStartDate())
                .endDate(habit.getEndDate())
                .active(habit.isActive())
                .archived(habit.isArchived())
                .completedToday(completedToday)
                .completionRate(completionRate)
                .createdAt(habit.getCreatedAt())
                .build();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LogRequest {
        private boolean completed;
        private String notes;
        private Integer mood;
        private LocalDate logDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LogResponse {
        private Long id;
        private Long habitId;
        private LocalDate logDate;
        private boolean completed;
        private String notes;
        private Integer mood;
        private LocalDateTime completedAt;

        public static LogResponse from(HabitLog log) {
            return LogResponse.builder()
                .id(log.getId())
                .habitId(log.getHabit().getId())
                .logDate(log.getLogDate())
                .completed(log.isCompleted())
                .notes(log.getNotes())
                .mood(log.getMood())
                .completedAt(log.getCompletedAt())
                .build();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatsResponse {
        private long totalHabits;
        private long activeHabits;
        private long completedToday;
        private double overallCompletionRate;
        private int longestCurrentStreak;
        private List<Response> topHabits;
        private List<DailyCompletion> weeklyData;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyCompletion {
        private LocalDate date;
        private int total;
        private int completed;
        private double rate;
    }
}
