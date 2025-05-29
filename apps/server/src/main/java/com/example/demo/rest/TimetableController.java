package com.example.demo.rest;

import com.example.demo.dao.ClassRepository;
import com.example.demo.dao.TeacherSubjectRepository;
import com.example.demo.dao.TimetableRepository;
import com.example.demo.dto.TimetableRequest;
import com.example.demo.entity.Class;
import com.example.demo.entity.TeacherSubject;
import com.example.demo.entity.Timetable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/timetables")
public class TimetableController {

  private final TimetableRepository timetableRepository;
  private final ClassRepository classRepository;
  private final TeacherSubjectRepository teacherSubjectRepository;

  public TimetableController(TimetableRepository timetableRepository,
                             ClassRepository classRepository,
                             TeacherSubjectRepository teacherSubjectRepository) {
    this.timetableRepository = timetableRepository;
    this.classRepository = classRepository;
    this.teacherSubjectRepository = teacherSubjectRepository;
  }

  @GetMapping
  public ResponseEntity<List<Timetable>> getAllTimetables() {
    List<Timetable> timetables = timetableRepository.findAll();
    return ResponseEntity.ok(timetables);
  }

  @PostMapping
  public ResponseEntity<?> createTimetable(@RequestBody TimetableRequest request) {
    // Find Class entity by ID
    Class studentClass = classRepository.findById(request.getClassId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid class ID"));

    // Find TeacherSubject entity by ID
    TeacherSubject teacherSubject = teacherSubjectRepository.findById(request.getTeacherSubjectId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid teacher subject ID"));

    // Create new Timetable entity and set fields
    Timetable timetable = new Timetable();
    timetable.setStudentClass(studentClass);
    timetable.setTeacherSubject(teacherSubject);
    timetable.setLesson_number(request.getLessonNumber());
    timetable.setDay(request.getDay());

    // Save to repository
    Timetable savedTimetable = timetableRepository.save(timetable);

    return ResponseEntity.ok(savedTimetable);
  }
}
