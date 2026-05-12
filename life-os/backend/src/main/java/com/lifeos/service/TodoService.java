package com.lifeos.service;

import com.lifeos.dto.TodoDto;
import com.lifeos.entity.Project;
import com.lifeos.entity.Todo;
import com.lifeos.entity.User;
import com.lifeos.repository.ProjectRepository;
import com.lifeos.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TodoService {

    private final TodoRepository todoRepository;
    private final ProjectRepository projectRepository;

    public TodoDto.Response createTodo(User user, TodoDto.CreateRequest request) {
        Project project = null;
        if (request.getProjectId() != null) {
            project = projectRepository.findByIdAndUser(request.getProjectId(), user)
                .orElse(null);
        }

        Todo parent = null;
        if (request.getParentId() != null) {
            parent = todoRepository.findByIdAndUser(request.getParentId(), user).orElse(null);
        }

        var todo = Todo.builder()
            .user(user).title(request.getTitle()).description(request.getDescription())
            .priority(request.getPriority()).status(request.getStatus())
            .dueDate(request.getDueDate()).dueTime(request.getDueTime())
            .tags(request.getTags()).estimatedMinutes(request.getEstimatedMinutes())
            .project(project).parent(parent)
            .orderIndex(request.getOrderIndex() != null ? request.getOrderIndex() : 0)
            .build();

        todo = todoRepository.save(todo);
        return TodoDto.Response.from(todo);
    }

    public List<TodoDto.Response> getAllTodos(User user) {
        return todoRepository.findByUserAndParentIsNullOrderByOrderIndexAscCreatedAtDesc(user)
            .stream().map(TodoDto.Response::from).collect(Collectors.toList());
    }

    public List<TodoDto.Response> getTodosByStatus(User user, Todo.Status status) {
        return todoRepository.findByUserAndStatus(user, status)
            .stream().map(TodoDto.Response::from).collect(Collectors.toList());
    }

    public TodoDto.Response updateTodo(User user, Long id, TodoDto.UpdateRequest request) {
        var todo = todoRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new RuntimeException("Todo not found"));

        if (request.getTitle() != null) todo.setTitle(request.getTitle());
        if (request.getDescription() != null) todo.setDescription(request.getDescription());
        if (request.getPriority() != null) todo.setPriority(request.getPriority());
        if (request.getStatus() != null) todo.setStatus(request.getStatus());
        if (request.getDueDate() != null) todo.setDueDate(request.getDueDate());
        if (request.getDueTime() != null) todo.setDueTime(request.getDueTime());
        if (request.getTags() != null) todo.setTags(request.getTags());
        if (request.getEstimatedMinutes() != null) todo.setEstimatedMinutes(request.getEstimatedMinutes());
        if (request.getActualMinutes() != null) todo.setActualMinutes(request.getActualMinutes());
        if (request.getOrderIndex() != null) todo.setOrderIndex(request.getOrderIndex());

        if (request.getCompleted() != null) {
            todo.setCompleted(request.getCompleted());
            if (request.getCompleted()) {
                todo.setCompletedAt(LocalDateTime.now());
                todo.setStatus(Todo.Status.DONE);
            } else {
                todo.setCompletedAt(null);
                todo.setStatus(Todo.Status.TODO);
            }
        }

        if (request.getProjectId() != null) {
            projectRepository.findByIdAndUser(request.getProjectId(), user)
                .ifPresent(todo::setProject);
        }

        todo = todoRepository.save(todo);
        return TodoDto.Response.from(todo);
    }

    public void deleteTodo(User user, Long id) {
        var todo = todoRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new RuntimeException("Todo not found"));
        todoRepository.delete(todo);
    }

    public TodoDto.Response toggleComplete(User user, Long id) {
        var todo = todoRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new RuntimeException("Todo not found"));

        todo.setCompleted(!todo.isCompleted());
        if (todo.isCompleted()) {
            todo.setCompletedAt(LocalDateTime.now());
            todo.setStatus(Todo.Status.DONE);
        } else {
            todo.setCompletedAt(null);
            todo.setStatus(Todo.Status.TODO);
        }

        todo = todoRepository.save(todo);
        return TodoDto.Response.from(todo);
    }

    public TodoDto.StatsResponse getStats(User user) {
        long total = todoRepository.countPendingByUser(user) + todoRepository.countCompletedByUser(user);
        long completed = todoRepository.countCompletedByUser(user);
        long pending = todoRepository.countPendingByUser(user);
        long overdue = todoRepository.findOverdueTasks(user, LocalDate.now()).size();

        var todayTasks = todoRepository.findByUserAndDueDateAndParentIsNull(user, LocalDate.now());
        var urgent = todoRepository.findByUserAndPriority(user, Todo.Priority.URGENT)
            .stream().filter(t -> !t.isCompleted()).collect(Collectors.toList());

        double rate = total > 0 ? (double) completed / total * 100 : 0;

        return TodoDto.StatsResponse.builder()
            .totalTasks(total).completedTasks(completed).pendingTasks(pending)
            .overdueTasks(overdue).todayTasks(todayTasks.size()).completionRate(rate)
            .todaysDueTasks(todayTasks.stream().map(TodoDto.Response::from).collect(Collectors.toList()))
            .urgentTasks(urgent.stream().map(TodoDto.Response::from).collect(Collectors.toList()))
            .build();
    }

    // Projects
    public TodoDto.ProjectResponse createProject(User user, TodoDto.ProjectRequest request) {
        var project = Project.builder()
            .user(user).name(request.getName()).description(request.getDescription())
            .color(request.getColor()).icon(request.getIcon()).dueDate(request.getDueDate())
            .build();
        project = projectRepository.save(project);
        return toProjectResponse(project);
    }

    public List<TodoDto.ProjectResponse> getAllProjects(User user) {
        return projectRepository.findByUserOrderByCreatedAtDesc(user)
            .stream().map(this::toProjectResponse).collect(Collectors.toList());
    }

    public void deleteProject(User user, Long id) {
        var project = projectRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new RuntimeException("Project not found"));
        projectRepository.delete(project);
    }

    private TodoDto.ProjectResponse toProjectResponse(Project p) {
        int total = p.getTodos().size();
        int done = (int) p.getTodos().stream().filter(Todo::isCompleted).count();
        double progress = total > 0 ? (double) done / total * 100 : 0;
        return TodoDto.ProjectResponse.builder()
            .id(p.getId()).name(p.getName()).description(p.getDescription())
            .color(p.getColor()).icon(p.getIcon()).status(p.getStatus())
            .dueDate(p.getDueDate()).totalTasks(total).completedTasks(done)
            .progress(progress).createdAt(p.getCreatedAt()).build();
    }
}
