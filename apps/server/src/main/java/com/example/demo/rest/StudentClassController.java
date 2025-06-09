package com.example.demo.rest;

import com.example.demo.dao.StudentClassRepository;
import com.example.demo.dao.StudentRepository;
import com.example.demo.dao.TeacherRepository;
import com.example.demo.dto.StudentClassRequest;
import com.example.demo.entity.*;

import com.example.demo.entity.StudentClass;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class StudentClassController {

  @Autowired
  private StudentClassRepository studentClassRepository;

  @Autowired
  private TeacherRepository teacherRepository;

  @Autowired
  private StudentRepository studentRepository;

  @PostMapping
  public ResponseEntity<?> createClass(@RequestBody StudentClassRequest request) {
    Teacher tutor = teacherRepository.findById(request.getTutorId())
      .orElseThrow(() -> new IllegalArgumentException("Invalid tutor ID"));

    StudentClass c = new StudentClass();
    c.setLetter(request.getLetter());
    c.setNumber(request.getNumber());
    c.setTutor(tutor);

    return ResponseEntity.ok(studentClassRepository.save(c));
  }

  @GetMapping
  public ResponseEntity<?> getAllClasses() {
    return ResponseEntity.ok(studentClassRepository.findAll());
  }

  @GetMapping("/{classId}")
  public ResponseEntity<StudentClass> getStudentClass(@PathVariable Integer classId){
    StudentClass studentClass = studentClassRepository.findById(classId)
      .orElseThrow(() -> new IllegalArgumentException("Invalid class ID"));

    return ResponseEntity.ok(studentClass);
  }

  @DeleteMapping("/delete/{classId}")
  public ResponseEntity<?> deleteClass(@PathVariable Integer classId){
    StudentClass studentClass = studentClassRepository.findById(classId)
      .orElseThrow(() -> new IllegalArgumentException("Invalid class ID"));

    List<Student> students = studentRepository.findByStudentClass(studentClass);
    if (!students.isEmpty()) {
      return ResponseEntity.badRequest().body("Cannot delete class with assigned students.");
    }

    studentClassRepository.delete(studentClass);
    return ResponseEntity.ok(studentClass);
  }

  @PutMapping("/update/{classId}")
  public ResponseEntity<?> updateClass(@PathVariable Integer classId, @RequestBody StudentClassRequest request){
    StudentClass studentClass = studentClassRepository.findById(classId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid class ID"));

    Teacher tutor = teacherRepository.findById(request.getTutorId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid teacher ID"));

    studentClass.setTutor(tutor);
    studentClass.setLetter(request.getLetter());
    studentClass.setNumber(request.getNumber());

    studentClassRepository.save(studentClass);
    return ResponseEntity.ok(studentClass);
  }
}
