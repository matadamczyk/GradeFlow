package com.example.demo.rest;

import com.example.demo.entity.Timetable;
import com.example.demo.entity.WorkDay;
import com.example.demo.service.TimetableService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/timetable")
public class TimetableController {

  private final TimetableService timetableService;

  public TimetableController(TimetableService timetableService) {
    this.timetableService = timetableService;
  }

  @GetMapping("/class/{classId}/day/{day}")
  public ResponseEntity<List<Timetable>> getTimetableForClassAndDay(
    @PathVariable Integer classId,
    @PathVariable WorkDay day) {
    List<Timetable> lessons = timetableService.getTimetableForClassAndDay(classId, day);
    return ResponseEntity.ok(lessons);
  }

  @PostMapping
  public ResponseEntity<Timetable> addLesson(@RequestBody Timetable lesson) {
    Timetable saved = timetableService.addLesson(lesson);
    return ResponseEntity.ok(saved);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Timetable> updateLesson(@PathVariable Integer id, @RequestBody Timetable lesson) {
    lesson.setLesson_id(id);
    Timetable updated = timetableService.updateLesson(lesson);
    return ResponseEntity.ok(updated);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteLesson(@PathVariable Integer id) {
    timetableService.deleteLesson(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Timetable> getLessonById(@PathVariable Integer id) {
    Timetable lesson = timetableService.getLessonById(id);
    if (lesson == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(lesson);
  }
}
