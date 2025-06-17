package com.example.demo.rest;

import com.example.demo.dao.ScheduleRepository;
import com.example.demo.dao.TimetableRepository;
import com.example.demo.dto.ScheduleRequest;
import com.example.demo.entity.Schedule;
import com.example.demo.entity.Timetable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

  @Autowired
  private ScheduleRepository scheduleRepository;

  @Autowired
  private TimetableRepository timetableRepository;

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping
  public ResponseEntity<List<Schedule>> getAllSchedules() {
    List<Schedule> schedules = scheduleRepository.findAll();
    return ResponseEntity.ok(schedules);
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/add")
  public ResponseEntity<?> addSchedule(@RequestBody ScheduleRequest request) {
    Timetable lesson = timetableRepository.findById(request.getLessonId())
      .orElseThrow(() -> new IllegalArgumentException("Invalid lesson ID"));

    Date date = request.getDate();
    if (date == null) {
      date = Date.valueOf(LocalDate.now());
    }

    String title = request.getTitle();
    if (title == null || title.trim().isEmpty()) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Title is required");
    }

    Schedule schedule = new Schedule(null, lesson, date, title, request.getComment());
    scheduleRepository.save(schedule);
    return ResponseEntity.ok(schedule);
  }

  @PreAuthorize("hasRole('ADMIN')")
  @DeleteMapping("/delete/{scheduleId}")
  public ResponseEntity<?> deleteSchedule(@PathVariable Integer scheduleId) {
    Schedule schedule = scheduleRepository.findById(scheduleId)
      .orElseThrow(() -> new IllegalArgumentException("Invalid schedule ID"));

    scheduleRepository.delete(schedule);
    return ResponseEntity.ok(schedule);
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PutMapping("/update/{scheduleId}")
  public ResponseEntity<?> updateSchedule(@PathVariable Integer scheduleId, @RequestBody ScheduleRequest request) {
    Schedule schedule = scheduleRepository.findById(scheduleId)
      .orElseThrow(() -> new IllegalArgumentException("Invalid schedule ID"));

    Timetable lesson = timetableRepository.findById(request.getLessonId())
      .orElseThrow(() -> new IllegalArgumentException("Invalid lesson ID"));

    schedule.setLesson(lesson);
    schedule.setDate(request.getDate());
    schedule.setTitle(request.getTitle());
    schedule.setComment(request.getComment());

    scheduleRepository.save(schedule);
    return ResponseEntity.ok(schedule);
  }
}

