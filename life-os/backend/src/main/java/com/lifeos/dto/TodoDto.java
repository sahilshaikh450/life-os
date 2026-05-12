package com.lifeos.dto;

import com.lifeos.entity.Todo;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class TodoDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotBlank
        private String title;
        private String description;
        private Todo.Priority priority;
        private Todo.Status status;
        private LocalDate dueDate;
        private LocalDateTime dueTime;
        private String tags;
        private Integer estimatedMinutes;
        private Long projectId;
        private Long parentId;
        private Integer orderIndex;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private String title;
        private String description;
        private Todo.Priority priority;
        private Todo.Status status;
        private LocalDate dueDate;
        private LocalDateTime dueTime;
        private String tags;
        private Integer estimatedMinutes;
        private Integer actualMinutes;
        private Boolean completed;
        private Long projectId;
        private Integer orderIndex;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String title;
        private String description;
        private Todo.Priority priority;
        private Todo.Status status;
        private LocalDate dueDate;
        private LocalDateTime dueTime;
        private boolean completed;
        private LocalDateTime completedAt;
        private String tags;
        private Integer estimatedMinutes;
        private Integer actualMinutes;
        private Integer orderIndex;
        private Long projectId;
        private String projectName;
        private Long parentId;
        private List<Response> subtasks;
        private boolean overdue;
        private LocalDateTime createdAt;

        public static Response from(Todo todo) {
            boolean overdue = todo.getDueDate() != null && !todo.isCompleted()
                && todo.getDueDate().isBefore(LocalDate.now());

            List<Response> subtaskList = todo.getSubtasks() == null ? List.of() :
                todo.getSubtasks().stream().map(Response::from).toList();

            return Response.builder()
                .id(todo.getId()).title(todo.getTitle()).description(todo.getDescription())
                .priority(todo.getPriority()).status(todo.getStatus())
                .dueDate(todo.getDueDate()).dueTime(todo.getDueTime())
                .completed(todo.isCompleted()).completedAt(todo.getCompletedAt())
                .tags(todo.getTags()).estimatedMinutes(todo.getEstimatedMinutes())
                .actualMinutes(todo.getActualMinutes()).orderIndex(todo.getOrderIndex())
                .projectId(todo.getProject() != null ? todo.getProject().getId() : null)
                .projectName(todo.getProject() != null ? todo.getProject().getName() : null)
                .parentId(todo.getParent() != null ? todo.getParent().getId() : null)
                .subtasks(subtaskList).overdue(overdue).createdAt(todo.getCreatedAt())
                .build();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatsResponse {
        private long totalTasks;
        private long completedTasks;
        private long pendingTasks;
        private long overdueTasks;
        private long todayTasks;
        private double completionRate;
        private List<Response> todaysDueTasks;
        private List<Response> urgentTasks;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProjectRequest {
        @NotBlank
        private String name;
        private String description;
        private String color;
        private String icon;
        private LocalDate dueDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProjectResponse {
        private Long id;
        private String name;
        private String description;
        private String color;
        private String icon;
        private com.lifeos.entity.Project.Status status;
        private LocalDate dueDate;
        private int totalTasks;
        private int completedTasks;
        private double progress;
        private LocalDateTime createdAt;
    }
}
