package com.example.demo.rest;

import com.example.demo.dao.StudentClassRepository;
import com.example.demo.dao.StudentRepository;
import com.example.demo.dto.StudentClassRequest;
import com.example.demo.dto.StudentRequest;
import com.example.demo.entity.Student;
import com.example.demo.entity.StudentClass;
import com.example.demo.entity.Teacher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

  @Autowired
  private StudentRepository studentRepository;

  @Autowired
  private StudentClassRepository studentClassRepository;

  @PostMapping
  public ResponseEntity<?> createStudent(@RequestBody StudentRequest request) {
    // Find class by ID
    StudentClass studentClass = studentClassRepository.findById(request.getClassId())
      .orElseThrow(() -> new IllegalArgumentException("Invalid class ID"));

    // Create and save student
    Student student = new Student(null, request.getName(), request.getLastname(), studentClass, request.getUserId());
    Student saved = studentRepository.save(student);

    return ResponseEntity.ok(saved);
  }

  @GetMapping
  public ResponseEntity<?> getAllStudents() {
    return ResponseEntity.ok(studentRepository.findAll());
  }

  @GetMapping("/studentClass/{studentClassId}")
  public ResponseEntity<List<Student>> getStudentsFromStudentClass(@PathVariable Integer studentClassId){
    StudentClass studentClass = studentClassRepository.findById(studentClassId)
      .orElseThrow(() -> new IllegalArgumentException("Invalid class ID"));

    return ResponseEntity.ok(studentRepository.findByStudentClass(studentClass));
  }

  @GetMapping("/user/{userId}")
  public ResponseEntity<Student> getStudentByUserId(@PathVariable Integer userId){
    Student student = studentRepository.findByUserId(userId)
      .orElseThrow(() -> new IllegalArgumentException("No student found for user ID: " + userId));

    return ResponseEntity.ok(student);
  }

  @DeleteMapping("/delete/{studentId}")
  public ResponseEntity<?> deleteStudent(@PathVariable Integer studentId){
    Student student = studentRepository.findById(studentId)
      .orElseThrow(() -> new IllegalArgumentException("Invalid student ID"));

    studentRepository.delete(student);

    return ResponseEntity.ok(student);
  }

  @PutMapping("/update/{studentId}")
  public ResponseEntity<?> updateStudent(@PathVariable Integer studentId, @RequestBody StudentRequest request){
    Student student = studentRepository.findById(studentId)
      .orElseThrow(() -> new IllegalArgumentException("Invalid student ID"));

    StudentClass studentClass = studentClassRepository.findById(request.getClassId())
      .orElseThrow(() -> new IllegalArgumentException("Invalid class ID"));


    student.setStudentClass(studentClass);
    student.setName(request.getName());
    student.setLastname(request.getLastname());
    student.setUserId(request.getUserId());

    studentRepository.save(student);
    return ResponseEntity.ok(student);
  }

}
