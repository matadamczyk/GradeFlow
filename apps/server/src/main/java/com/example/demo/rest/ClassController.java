package com.example.demo.rest;

import com.example.demo.dao.ClassRepository;
import com.example.demo.dao.TeacherRepository;
import com.example.demo.dto.ClassRequest;
import com.example.demo.entity.Class;
import com.example.demo.entity.Teacher;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/classes")
public class ClassController {

  @Autowired
  private ClassRepository classRepository;

  @Autowired
  private TeacherRepository teacherRepository;

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
}
