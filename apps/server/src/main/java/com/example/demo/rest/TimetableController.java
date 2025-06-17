package com.example.demo.rest;

import com.example.demo.dao.StudentClassRepository;
import com.example.demo.dao.StudentRepository;
import com.example.demo.dao.TeacherSubjectRepository;
import com.example.demo.dao.TimetableRepository;
import com.example.demo.dto.GradeRequest;
import com.example.demo.dto.TimetableRequest;
import com.example.demo.entity.*;
import org.hibernate.type.IdentifierBagType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Time;
import java.util.List;

@RestController
@RequestMapping("/api/timetables")
public class TimetableController {

  private final TimetableRepository timetableRepository;
  private final StudentClassRepository classRepository;
  private final TeacherSubjectRepository teacherSubjectRepository;
  private final StudentRepository studentRepository;

  public TimetableController(TimetableRepository timetableRepository,
                             StudentClassRepository studentClassRepository,
                             TeacherSubjectRepository teacherSubjectRepository,
                             StudentRepository studentRepository) {
    this.timetableRepository = timetableRepository;
    this.classRepository = studentClassRepository;
    this.teacherSubjectRepository = teacherSubjectRepository;
    this.studentRepository = studentRepository;
  }

  @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN') or hasRole('TEACHER') or hasRole('PARENT')")
  @GetMapping
  public ResponseEntity<List<Timetable>> getAllTimetables() {
    List<Timetable> timetables = timetableRepository.findAll();
    return ResponseEntity.ok(timetables);
  }

  @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN') or hasRole('TEACHER') or hasRole('PARENT')")
  @GetMapping("/studentClass/{studentClassId}")
  public ResponseEntity<List<Timetable>> getTimetableForStudentClass(@PathVariable Integer studentClassId){
    User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    // Jeśli STUDENT — sprawdzamy, czy należy do tej klasy
    if (currentUser.getRole().name().equals("STUDENT")) {
      // Znajdź ucznia powiązanego z aktualnym userem

      Student student = studentRepository.findByUserId(currentUser.getId())
        .orElseThrow(() -> new IllegalArgumentException("No student found for user"));

      if (!student.getStudentClass().getId().equals(studentClassId)) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
      }
    }

    StudentClass studentClass = classRepository.findById(studentClassId)
      .orElseThrow(() -> new IllegalArgumentException("Invalid class ID"));

    List<Timetable> timetables = timetableRepository.findByStudentClass(studentClass);
    return  ResponseEntity.ok(timetables);
  }



  @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
  @GetMapping("/teacher/{teacherId}")
  public ResponseEntity<List<Timetable>> getTimetableByTeacher(@PathVariable Integer teacherId) {
    List<Timetable> timetable = timetableRepository.findByTeacherId(teacherId);
    return ResponseEntity.ok(timetable);
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping
  public ResponseEntity<?> createTimetable(@RequestBody TimetableRequest request) {
    // Find Class entity by ID
    StudentClass studentClass = classRepository.findById(request.getClassId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid class ID"));

    // Find TeacherSubject entity by ID
    TeacherSubject teacherSubject = teacherSubjectRepository.findById(request.getTeacherSubjectId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid teacherSubject ID"));

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

  @PreAuthorize("hasRole('ADMIN')")
  @DeleteMapping("/delete/{lessonId}")
  public ResponseEntity<?> deleteTimetable(@PathVariable Integer lessonId){
    Timetable lesson = timetableRepository.findById(lessonId)
      .orElseThrow(() -> new IllegalArgumentException("Invalid lesson ID"));

    timetableRepository.delete(lesson);

    return ResponseEntity.ok(lesson);
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PutMapping("/update/{lessonId}")
  public ResponseEntity<?> updateTimetable(@PathVariable Integer lessonId, @RequestBody TimetableRequest request){
    Timetable lesson = timetableRepository.findById(lessonId)
      .orElseThrow(() -> new IllegalArgumentException("Invalid lesson ID"));

    TeacherSubject teacherSubject = teacherSubjectRepository.findById(request.getTeacherSubjectId())
      .orElseThrow(() -> new IllegalArgumentException("Invalid teacher subject ID"));

    StudentClass studentClass = classRepository.findById(request.getClassId())
      .orElseThrow(() -> new IllegalArgumentException("Invalid class ID"));

    lesson.setTeacherSubject(teacherSubject);
    lesson.setStudentClass(studentClass);
    lesson.setLesson_number(request.getLessonNumber());
    lesson.setDay(request.getDay());

    timetableRepository.save(lesson);
    return ResponseEntity.ok(lesson);

  }
}
