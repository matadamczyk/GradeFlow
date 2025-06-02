package com.example.demo.rest;

import com.example.demo.dao.ClassRepository;
import com.example.demo.dao.StudentRepository;
import com.example.demo.dao.TeacherRepository;
import com.example.demo.dto.ClassRequest;
import com.example.demo.entity.*;

import com.example.demo.entity.Class;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/classes")
public class ClassController {

  @Autowired
  private ClassRepository classRepository;

  @Autowired
  private TeacherRepository teacherRepository;

  @Autowired
  private StudentRepository studentRepository;

  @PostMapping
  public ResponseEntity<?> createClass(@RequestBody ClassRequest request) {
    Teacher tutor = teacherRepository.findById(request.getTutorId())
      .orElseThrow(() -> new IllegalArgumentException("Invalid tutor ID"));

    Class c = new Class();
    c.setLetter(request.getLetter());
    c.setNumber(request.getNumber());
    c.setTutor(tutor);

    return ResponseEntity.ok(classRepository.save(c));
  }

  @GetMapping
  public ResponseEntity<?> getAllClasses() {
    return ResponseEntity.ok(classRepository.findAll());
  }

  @GetMapping("/{classId}")
  public ResponseEntity<List<Student>> getStudentsFromClass(@PathVariable Integer classId){
    Class studentClass = classRepository.findById(classId)
      .orElseThrow(() -> new IllegalArgumentException("Invalid class ID"));

    List<Student> students = studentRepository.findByStudentClass(studentClass);

    return ResponseEntity.ok(students);
  }

  @DeleteMapping("/delete/{classId}")
  public ResponseEntity<?> deleteClass(@PathVariable Integer classId){
    Class studentClass = classRepository.findById(classId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid class ID"));

    classRepository.delete(studentClass);

    return ResponseEntity.ok(studentClass);
  }

  @PutMapping("/update/{classId}")
  public ResponseEntity<?> updateClass(@PathVariable Integer classId, @RequestBody ClassRequest request){
    Class studentClass = classRepository.findById(classId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid class ID"));

    Teacher tutor = teacherRepository.findById(request.getTutorId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid teacher ID"));

    studentClass.setTutor(tutor);
    studentClass.setLetter(request.getLetter());
    studentClass.setNumber(request.getNumber());

    classRepository.save(studentClass);
    return ResponseEntity.ok(studentClass);
  }
}
