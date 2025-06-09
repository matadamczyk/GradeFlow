package com.example.demo.rest;

import com.example.demo.dao.SubjectRepository;
import com.example.demo.dao.TeacherRepository;
import com.example.demo.dao.TeacherSubjectRepository;
import com.example.demo.dto.TeacherSubjectRequest;
import com.example.demo.entity.Subject;
import com.example.demo.entity.Teacher;
import com.example.demo.entity.TeacherSubject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/teacherSubjects")
public class TeacherSubjectController {

  private final TeacherRepository teacherRepository;
  private final SubjectRepository subjectRepository;
  private final TeacherSubjectRepository teacherSubjectRepository;

  public TeacherSubjectController(TeacherRepository teacherRepository, SubjectRepository subjectRepository, TeacherSubjectRepository teacherSubjectRepository) {
    this.teacherRepository = teacherRepository;
    this.subjectRepository = subjectRepository;
    this.teacherSubjectRepository = teacherSubjectRepository;
  }

  @PostMapping
  public ResponseEntity<?> assignSubjectToTeacher(@RequestBody TeacherSubjectRequest dto) {
    Optional<Teacher> teacherOpt = teacherRepository.findById(dto.getTeacher_id());
    Optional<Subject> subjectOpt = subjectRepository.findById(dto.getSubject_id());

    if (teacherOpt.isEmpty() || subjectOpt.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Teacher or Subject not found");
    }

    TeacherSubject ts = new TeacherSubject();
    ts.setTeacher(teacherOpt.get());
    ts.setSubject(subjectOpt.get());

    teacherSubjectRepository.save(ts);

    return ResponseEntity.ok("Assignment saved successfully");
  }

  @GetMapping
  public ResponseEntity<List<TeacherSubject>> getAllAssignments() {
    List<TeacherSubject> assignments = teacherSubjectRepository.findAll();
    return ResponseEntity.ok(assignments);
  }

}
