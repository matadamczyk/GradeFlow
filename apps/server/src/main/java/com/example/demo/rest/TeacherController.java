package com.example.demo.rest;

import com.example.demo.dao.StudentClassRepository;
import com.example.demo.dao.StudentRepository;
import com.example.demo.dao.TeacherRepository;
import com.example.demo.dao.TeacherSubjectRepository;
import com.example.demo.dao.TimetableRepository;
import com.example.demo.dto.StudentClassRequest;
import com.example.demo.dto.StudentRequest;
import com.example.demo.dto.TeacherRequest;
import com.example.demo.entity.Student;
import com.example.demo.entity.StudentClass;
import com.example.demo.entity.Teacher;
import com.example.demo.entity.TeacherSubject;
import com.example.demo.entity.Timetable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

  @Autowired
  private TeacherRepository teacherRepository;
  @Autowired
  private StudentClassRepository studentClassRepository;
  @Autowired
  private TeacherSubjectRepository teacherSubjectRepository;
  @Autowired
  private TimetableRepository timetableRepository;

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping
  public ResponseEntity<?> createTeacher(@RequestBody TeacherRequest request) {

    Teacher saved = teacherRepository.save(new Teacher(null, request.getName(), request.getLastname()));

    return ResponseEntity.ok(saved);
  }

  @PreAuthorize("hasRole('ADMIN') or hasRole('STUDENT') or hasRole('TEACHER') or hasRole('PARENT')")
  @GetMapping
  public ResponseEntity<?> getAllTeachers() {
    return ResponseEntity.ok(teacherRepository.findAll());
  }

  //Zwraca nauczycieli, ktorzy ucza dana klase
  @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN') or hasRole('TEACHER') or hasRole('PARENT')")
  @GetMapping("/studentClass/{studentClassId}")
  public ResponseEntity<List<Teacher>> getTeachersByStudentClassFromTimetable(@PathVariable Integer studentClassId){
    List<Teacher> teachers = teacherRepository.findTeachersByClassId(studentClassId);

    return ResponseEntity.ok(teachers);
  }


  @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
  @GetMapping("/{teacherId}/classes")
  public ResponseEntity<List<StudentClass>> getTeacherClasses(@PathVariable Integer teacherId) {
    Teacher teacher = teacherRepository.findById(teacherId)
        .orElseThrow(() -> new IllegalArgumentException("Invalid teacher ID"));


    List<Timetable> timetables = timetableRepository.findByTeacherSubjectTeacher(teacher);
    List<StudentClass> classes = timetables.stream()
        .map(Timetable::getStudentClass)
        .distinct()
        .collect(Collectors.toList());

    return ResponseEntity.ok(classes);
  }


  @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
  @GetMapping("/{teacherId}/subjects")
  public ResponseEntity<List<TeacherSubject>> getTeacherSubjects(@PathVariable Integer teacherId) {
    Teacher teacher = teacherRepository.findById(teacherId)
        .orElseThrow(() -> new IllegalArgumentException("Invalid teacher ID"));

    List<TeacherSubject> teacherSubjects = teacherSubjectRepository.findByTeacher(teacher);
    return ResponseEntity.ok(teacherSubjects);
  }

  //Usuwa nauczyciela pod warunkiem ze nie jest wychowawca klasy, jesli nei jest to usuwa takze polaczenia w teacherSubject
  @PreAuthorize("hasRole('ADMIN')")
  @DeleteMapping("/delete/{teacherId}")
  public ResponseEntity<?> deleteTeacher(@PathVariable Integer teacherId){
    Teacher teacher = teacherRepository.findById(teacherId)
      .orElseThrow(() -> new IllegalArgumentException("Invalid teacher ID"));

    StudentClass studentClass = studentClassRepository.findByTutor(teacher);

    if (studentClass != null) {
      return ResponseEntity.badRequest().body("Cannot delete teacher with assigned class.");
    }

    teacherSubjectRepository.deleteByTeacherId(teacherId);

    teacherRepository.delete(teacher);

    return ResponseEntity.ok(teacher);
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PutMapping("/update/{teacherId}")
  public ResponseEntity<?> updateTeacher(@PathVariable Integer teacherId, @RequestBody TeacherRequest request){
    Teacher teacher = teacherRepository.findById(teacherId)
      .orElseThrow(() -> new IllegalArgumentException("Invalid teacher ID"));

    teacher.setName(request.getName());
    teacher.setLastname(request.getLastname());

    teacherRepository.save(teacher);
    return ResponseEntity.ok(teacher);
  }

}
