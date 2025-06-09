package com.example.demo.rest;

import com.example.demo.dao.PresenceRepository;
import com.example.demo.dao.StudentRepository;
import com.example.demo.dao.TimetableRepository;
import com.example.demo.dto.PresenceRequest;
import com.example.demo.entity.Presence;
import com.example.demo.entity.Student;
import com.example.demo.entity.Timetable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/presences")
public class PresenceController {

  @Autowired
  private PresenceRepository presenceRepository;

  @Autowired
  private StudentRepository studentRepository;

  @Autowired
  private TimetableRepository timetableRepository;

  @PostMapping
  public ResponseEntity<?> createPresence(@RequestBody PresenceRequest request) {
    // Load Student
    Student student = studentRepository.findById(request.getStudentId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid student ID"));

    // Load Timetable (lesson)
    Timetable lesson = timetableRepository.findById(request.getLessonId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid lesson ID"));

    // Use provided date or today's date if null
    Date date = request.getDate();
    if (date == null) {
      date = Date.valueOf(LocalDate.now());  // current date
    }

    Presence presence = new Presence();
    presence.setStudent(student);
    presence.setLesson(lesson);
    presence.setDate(date);

    presenceRepository.save(presence);

    return ResponseEntity.ok(presence);
  }

  // Add GET methods if needed
  @GetMapping
  public ResponseEntity<List<Presence>> getAllPresences() {
    List<Presence> presences = presenceRepository.findAll();
    return ResponseEntity.ok(presences);
  }

}
