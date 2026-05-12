package com.lifeos.controller;

import com.lifeos.dto.HabitDto;
import com.lifeos.entity.User;
import com.lifeos.service.HabitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/habits")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService habitService;

    @PostMapping
    public ResponseEntity<HabitDto.Response> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody HabitDto.CreateRequest request) {

        return ResponseEntity.ok(
                habitService.createHabit(user, request)
        );
    }

    @GetMapping
    public ResponseEntity<List<HabitDto.Response>> getAll(
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(
                habitService.getAllHabits(user)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<HabitDto.Response> getOne(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        return ResponseEntity.ok(
                habitService.getHabit(user, id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<HabitDto.Response> update(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody HabitDto.UpdateRequest request) {

        return ResponseEntity.ok(
                habitService.updateHabit(user, id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        habitService.deleteHabit(user, id);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/archive")
    public ResponseEntity<Void> archive(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        habitService.archiveHabit(user, id);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/log")
    public ResponseEntity<HabitDto.LogResponse> log(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody HabitDto.LogRequest request) {

        return ResponseEntity.ok(
                habitService.logHabit(user, id, request)
        );
    }

    @GetMapping("/{id}/logs")
    public ResponseEntity<List<HabitDto.LogResponse>> getLogs(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate start,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate end) {

        if (start == null) {
            start = LocalDate.now().minusDays(30);
        }

        if (end == null) {
            end = LocalDate.now();
        }

        return ResponseEntity.ok(
                habitService.getHabitLogs(user, id, start, end)
        );
    }

    @GetMapping("/stats")
    public ResponseEntity<HabitDto.StatsResponse> getStats(
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(
                habitService.getStats(user)
        );
    }
}