package com.example.demo.rest;

import com.example.demo.dao.ClassRepository;
import com.example.demo.dao.StudentRepository;
import com.example.demo.dto.StudentRequest;
import com.example.demo.entity.Student;
import com.example.demo.entity.Class;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/students")
public class StudentController {

  @Autowired
  private StudentRepository studentRepository;

  @Autowired
  private ClassRepository classRepository;

  @PostMapping
  public ResponseEntity<?> createStudent(@RequestBody StudentRequest request) {
    // Find class by ID
    Class studentClass = classRepository.findById(request.getClassid())
      .orElseThrow(() -> new IllegalArgumentException("Invalid class ID"));

    // Create and save student
    Student student = new Student(null, request.getName(), request.getLastname(), studentClass);
    Student saved = studentRepository.save(student);

    return ResponseEntity.ok(saved);
  }

  @GetMapping
  public ResponseEntity<?> getAllStudents() {
    return ResponseEntity.ok(studentRepository.findAll());
  }

}
