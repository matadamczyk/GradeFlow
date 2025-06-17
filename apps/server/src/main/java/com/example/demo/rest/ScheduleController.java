package com.example.demo.rest;

import com.example.demo.dao.ScheduleRepository;
import com.example.demo.dao.StudentClassRepository;
import com.example.demo.dao.TimetableRepository;
import com.example.demo.dto.ScheduleRequest;
import com.example.demo.entity.Schedule;
import com.example.demo.entity.StudentClass;
import com.example.demo.entity.Timetable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

  @Autowired
  private ScheduleRepository scheduleRepository;

  @Autowired
  private TimetableRepository timetableRepository;

  @Autowired
  private StudentClassRepository studentClassRepository;

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping
  public ResponseEntity<List<Schedule>> getAllSchedules() {
    List<Schedule> schedules = scheduleRepository.findAll();
    return ResponseEntity.ok(schedules);
  }

  // New endpoint for getting schedules by class (used by frontend as events)
  @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN') or hasRole('STUDENT') or hasRole('PARENT')")
  @GetMapping("/class/{classId}")
  public ResponseEntity<List<Schedule>> getSchedulesByClass(@PathVariable Integer classId) {
    StudentClass studentClass = studentClassRepository.findById(classId)
      .orElseThrow(() -> new IllegalArgumentException("Invalid class ID"));

    // Get all timetables for this class, then find schedules for those timetables
    List<Timetable> classTimetables = timetableRepository.findByStudentClass(studentClass);
    List<Schedule> schedules = scheduleRepository.findByLessonIn(classTimetables);
    
    return ResponseEntity.ok(schedules);
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
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

  @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
  @DeleteMapping("/delete/{scheduleId}")
  public ResponseEntity<?> deleteSchedule(@PathVariable Integer scheduleId) {
    Schedule schedule = scheduleRepository.findById(scheduleId)
      .orElseThrow(() -> new IllegalArgumentException("Invalid schedule ID"));

    scheduleRepository.delete(schedule);
    return ResponseEntity.ok(schedule);
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
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

