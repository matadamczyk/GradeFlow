package com.example.demo.rest;

import com.example.demo.dao.PresenceRepository;
import com.example.demo.dao.StudentRepository;
import com.example.demo.dao.TimetableRepository;
import com.example.demo.dto.PresenceRequest;
import com.example.demo.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

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

  @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
  @PostMapping
  public ResponseEntity<?> createPresence(@RequestBody PresenceRequest request) {

    Student student = studentRepository.findById(request.getStudentId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid student ID"));


    Timetable lesson = timetableRepository.findById(request.getLessonId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid lesson ID"));


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

  @PreAuthorize("hasRole('ADMIN')")
  @GetMapping
  public ResponseEntity<List<Presence>> getAllPresences() {
    List<Presence> presences = presenceRepository.findAll();
    return ResponseEntity.ok(presences);
  }

  @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN') or hasRole('TEACHER') or hasRole('PARENT')")
  @GetMapping("/student/{studentId}")
  public ResponseEntity<List<Presence>> getPresences(@PathVariable Integer studentId){
    Student student = studentRepository.findById(studentId)
      .orElseThrow(() -> new IllegalArgumentException("Invalid student ID"));

    User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    if (currentUser.getRole().name().equals("STUDENT") &&
      (student.getUserId() == null || !currentUser.getId().equals(student.getUserId()))) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }


    List<Presence> presences = presenceRepository.findByStudent(student);
    return ResponseEntity.ok(presences);
  }

}
