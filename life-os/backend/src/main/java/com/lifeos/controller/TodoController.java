package com.lifeos.controller;

import com.lifeos.dto.TodoDto;
import com.lifeos.entity.Todo;
import com.lifeos.entity.User;
import com.lifeos.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    @PostMapping
    public ResponseEntity<TodoDto.Response> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody TodoDto.CreateRequest request) {

        return ResponseEntity.ok(
                todoService.createTodo(user, request)
        );
    }

    @GetMapping
    public ResponseEntity<List<TodoDto.Response>> getAll(
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(
                todoService.getAllTodos(user)
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<TodoDto.Response>> getByStatus(
            @AuthenticationPrincipal User user,
            @PathVariable Todo.Status status) {

        return ResponseEntity.ok(
                todoService.getTodosByStatus(user, status)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<TodoDto.Response> update(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody TodoDto.UpdateRequest request) {

        return ResponseEntity.ok(
                todoService.updateTodo(user, id, request)
        );
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TodoDto.Response> toggle(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        return ResponseEntity.ok(
                todoService.toggleComplete(user, id)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        todoService.deleteTodo(user, id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<TodoDto.StatsResponse> getStats(
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(
                todoService.getStats(user)
        );
    }

    // Projects

    @PostMapping("/projects")
    public ResponseEntity<TodoDto.ProjectResponse> createProject(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody TodoDto.ProjectRequest request) {

        return ResponseEntity.ok(
                todoService.createProject(user, request)
        );
    }

    @GetMapping("/projects")
    public ResponseEntity<List<TodoDto.ProjectResponse>> getProjects(
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(
                todoService.getAllProjects(user)
        );
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<Void> deleteProject(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        todoService.deleteProject(user, id);

        return ResponseEntity.noContent().build();
    }
}