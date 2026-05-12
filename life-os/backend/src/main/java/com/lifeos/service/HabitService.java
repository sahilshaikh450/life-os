package com.lifeos.service;

import com.lifeos.dto.HabitDto;
import com.lifeos.entity.Habit;
import com.lifeos.entity.HabitLog;
import com.lifeos.entity.User;
import com.lifeos.repository.HabitLogRepository;
import com.lifeos.repository.HabitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class HabitService {

    private final HabitRepository habitRepository;
    private final HabitLogRepository habitLogRepository;

    public HabitDto.Response createHabit(User user, HabitDto.CreateRequest request) {
        var habit = Habit.builder()
            .user(user)
            .name(request.getName())
            .description(request.getDescription())
            .icon(request.getIcon())
            .color(request.getColor())
            .frequency(request.getFrequency() != null ? request.getFrequency() : Habit.Frequency.DAILY)
            .category(request.getCategory() != null ? request.getCategory() : Habit.Category.OTHER)
            .targetDays(request.getTargetDays())
            .startDate(request.getStartDate())
            .endDate(request.getEndDate())
            .build();

        habit = habitRepository.save(habit);
        return buildResponse(habit, user);
    }

    public List<HabitDto.Response> getAllHabits(User user) {
        return habitRepository.findByUserAndArchivedFalseOrderByCreatedAtDesc(user)
            .stream().map(h -> buildResponse(h, user)).collect(Collectors.toList());
    }

    public HabitDto.Response getHabit(User user, Long id) {
        var habit = habitRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new RuntimeException("Habit not found"));
        return buildResponse(habit, user);
    }

    public HabitDto.Response updateHabit(User user, Long id, HabitDto.UpdateRequest request) {
        var habit = habitRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new RuntimeException("Habit not found"));

        if (request.getName() != null) habit.setName(request.getName());
        if (request.getDescription() != null) habit.setDescription(request.getDescription());
        if (request.getIcon() != null) habit.setIcon(request.getIcon());
        if (request.getColor() != null) habit.setColor(request.getColor());
        if (request.getFrequency() != null) habit.setFrequency(request.getFrequency());
        if (request.getCategory() != null) habit.setCategory(request.getCategory());
        if (request.getTargetDays() != null) habit.setTargetDays(request.getTargetDays());
        if (request.getEndDate() != null) habit.setEndDate(request.getEndDate());
        if (request.getActive() != null) habit.setActive(request.getActive());

        habit = habitRepository.save(habit);
        return buildResponse(habit, user);
    }

    public void deleteHabit(User user, Long id) {
        var habit = habitRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new RuntimeException("Habit not found"));
        habitRepository.delete(habit);
    }

    public void archiveHabit(User user, Long id) {
        var habit = habitRepository.findByIdAndUser(id, user)
            .orElseThrow(() -> new RuntimeException("Habit not found"));
        habit.setArchived(true);
        habitRepository.save(habit);
    }

    public HabitDto.LogResponse logHabit(User user, Long habitId, HabitDto.LogRequest request) {
        var habit = habitRepository.findByIdAndUser(habitId, user)
            .orElseThrow(() -> new RuntimeException("Habit not found"));

        LocalDate logDate = request.getLogDate() != null ? request.getLogDate() : LocalDate.now();

        var existingLog = habitLogRepository.findByHabitAndLogDate(habit, logDate);

        HabitLog log;
        if (existingLog.isPresent()) {
            log = existingLog.get();
            log.setCompleted(request.isCompleted());
            log.setNotes(request.getNotes());
            log.setMood(request.getMood());
            if (request.isCompleted()) log.setCompletedAt(java.time.LocalDateTime.now());
        } else {
            log = HabitLog.builder()
                .habit(habit)
                .logDate(logDate)
                .completed(request.isCompleted())
                .notes(request.getNotes())
                .mood(request.getMood())
                .completedAt(request.isCompleted() ? java.time.LocalDateTime.now() : null)
                .build();
        }

        log = habitLogRepository.save(log);
        updateStreakAndStats(habit);
        return HabitDto.LogResponse.from(log);
    }

    public List<HabitDto.LogResponse> getHabitLogs(User user, Long habitId, LocalDate start, LocalDate end) {
        var habit = habitRepository.findByIdAndUser(habitId, user)
            .orElseThrow(() -> new RuntimeException("Habit not found"));

        return habitLogRepository.findByHabitAndLogDateBetweenOrderByLogDateDesc(habit, start, end)
            .stream().map(HabitDto.LogResponse::from).collect(Collectors.toList());
    }

    public HabitDto.StatsResponse getStats(User user) {
        var habits = habitRepository.findByUserAndArchivedFalseOrderByCreatedAtDesc(user);
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.minusDays(6);

        long totalHabits = habits.size();
        long activeHabits = habits.stream().filter(Habit::isActive).count();

        var todayLogs = habitLogRepository.findByUserIdAndDate(user.getId(), today);
        long completedToday = todayLogs.stream().filter(HabitLog::isCompleted).count();

        double overallRate = 0;
        int maxStreak = 0;
        if (!habits.isEmpty()) {
            overallRate = habits.stream().mapToDouble(h -> {
                long total = habitLogRepository.countCompletedByHabit(h);
                long days = ChronoUnit.DAYS.between(h.getStartDate(), today) + 1;
                return days > 0 ? (double) total / days * 100 : 0;
            }).average().orElse(0);
            maxStreak = habits.stream().mapToInt(Habit::getCurrentStreak).max().orElse(0);
        }

        // Weekly data
        List<HabitDto.DailyCompletion> weeklyData = new ArrayList<>();
        var weekLogs = habitLogRepository.findByUserIdAndDateRange(user.getId(), weekStart, today);
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            long dayTotal = habits.size();
            long dayCompleted = weekLogs.stream()
                .filter(l -> l.getLogDate().equals(date) && l.isCompleted()).count();
            weeklyData.add(HabitDto.DailyCompletion.builder()
                .date(date).total((int)dayTotal).completed((int)dayCompleted)
                .rate(dayTotal > 0 ? (double) dayCompleted / dayTotal * 100 : 0)
                .build());
        }

        return HabitDto.StatsResponse.builder()
            .totalHabits(totalHabits).activeHabits(activeHabits)
            .completedToday(completedToday).overallCompletionRate(overallRate)
            .longestCurrentStreak(maxStreak).weeklyData(weeklyData)
            .topHabits(habits.stream().limit(5).map(h -> buildResponse(h, user)).collect(Collectors.toList()))
            .build();
    }

    private void updateStreakAndStats(Habit habit) {
        LocalDate today = LocalDate.now();
        int streak = 0;
        LocalDate checkDate = today;

        while (true) {
            var log = habitLogRepository.findByHabitAndLogDate(habit, checkDate);
            if (log.isPresent() && log.get().isCompleted()) {
                streak++;
                checkDate = checkDate.minusDays(1);
            } else {
                break;
            }
        }

        habit.setCurrentStreak(streak);
        if (streak > habit.getLongestStreak()) habit.setLongestStreak(streak);
        habit.setTotalCompletions((int) habitLogRepository.countCompletedByHabit(habit));
        habitRepository.save(habit);
    }

    private HabitDto.Response buildResponse(Habit habit, User user) {
        LocalDate today = LocalDate.now();
        boolean completedToday = habitLogRepository.findByHabitAndLogDate(habit, today)
            .map(HabitLog::isCompleted).orElse(false);

        long totalCompleted = habitLogRepository.countCompletedByHabit(habit);
        long totalDays = ChronoUnit.DAYS.between(habit.getStartDate(), today) + 1;
        double rate = totalDays > 0 ? (double) totalCompleted / totalDays * 100 : 0;

        return HabitDto.Response.from(habit, completedToday, rate);
    }
}
