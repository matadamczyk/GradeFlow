package com.example.demo.rest;

import com.example.demo.dao.GradeRepository;
import com.example.demo.dao.StudentRepository;
import com.example.demo.dao.TeacherSubjectRepository;
import com.example.demo.dao.TimetableRepository;
import com.example.demo.dto.GradeRequest;
import com.example.demo.entity.Grade;
import com.example.demo.entity.Student;
import com.example.demo.entity.TeacherSubject;
import com.example.demo.entity.Timetable;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/grades")
public class GradeController {

  @Autowired
  private GradeRepository gradeRepository;

  @Autowired
  private StudentRepository studentRepository;

  @Autowired
  private TeacherSubjectRepository teacherSubjectRepository;

  @Autowired
  private TimetableRepository timetableRepository;


  @GetMapping("/student/{studentId}/teacherSubject/{teacherSubjectId}")
  public ResponseEntity<List<Grade>> getGradesFromTeacherSubject(@PathVariable Integer studentId, @PathVariable Integer teacherSubjectId) {

    Student student = studentRepository.findById(studentId)
      .orElseThrow(() -> new IllegalArgumentException("Invalid student ID"));

    TeacherSubject teacherSubject = teacherSubjectRepository.findById(teacherSubjectId)
      .orElseThrow(() -> new IllegalArgumentException("Invalid teacherSubject ID"));

    List<Grade> grades = gradeRepository.findByStudentAndTeacherSubject(student,teacherSubject);

    return ResponseEntity.ok(grades);
  }

  @GetMapping("/student/{studentId}")
  public ResponseEntity<List<Grade>> getGrades(@PathVariable Integer studentId){

    Student student = studentRepository.findById(studentId)
      .orElseThrow(() -> new IllegalArgumentException("Invalid student ID"));

    List<Grade> grades = gradeRepository.findByStudent(student);
    return ResponseEntity.ok(grades);
  }

  //ogólne dodanie oceny
  @PostMapping("/add")
  public ResponseEntity<?> addGrade(@RequestBody GradeRequest request){
    Student student = studentRepository.findById(request.getStudentId())
      .orElseThrow(() -> new IllegalArgumentException("Invalid student ID"));

    TeacherSubject teacherSubject = teacherSubjectRepository.findById(request.getTeacherSubjectId())
      .orElseThrow(() -> new IllegalArgumentException("Invalid teacherSubject ID"));

    Timetable lesson = timetableRepository.findById(request.getLessonId())
      .orElseThrow(() -> new IllegalArgumentException("Invalid lesson ID"));

    Date date = request.getDate();
    if(date == null){
      date = Date.valueOf(LocalDate.now());
    }

    Float grade_value = request.getGrade_value();
    if(grade_value == null){
      grade_value = 0.0f;
    }

    Integer grade_weight = request.getGrade_weight();
    if(grade_weight == null){
      grade_weight = 1;
    }

    String comment = request.getComment();

    Grade grade = new Grade(student,teacherSubject,lesson,date,grade_value,grade_weight,comment);
    gradeRepository.save(grade);

    return ResponseEntity.ok(grade);
  }


  @DeleteMapping("/delete/{gradeId}")
  public ResponseEntity<?> deleteGrade(@PathVariable Integer gradeId){
    Grade grade = gradeRepository.findById(gradeId)
      .orElseThrow(() -> new IllegalArgumentException("Invalid grade ID"));

    gradeRepository.delete(grade);

    return ResponseEntity.ok(grade);
  }

  @PutMapping("/update/{gradeId}")
  public ResponseEntity<?> updateGrade(@PathVariable Integer gradeId, @RequestBody GradeRequest request){
    Grade grade = gradeRepository.findById(gradeId)
      .orElseThrow(() -> new IllegalArgumentException("Invalid grade ID"));

    TeacherSubject teacherSubject = teacherSubjectRepository.findById(request.getTeacherSubjectId())
      .orElseThrow(() -> new IllegalArgumentException("Invalid teacherSubject ID"));

    Timetable lesson = timetableRepository.findById(request.getLessonId())
      .orElseThrow(() -> new IllegalArgumentException("Invalid lesson ID"));

    grade.setTeacherSubject(teacherSubject);
    grade.setLesson(lesson);
    grade.setDate(request.getDate());
    grade.setGrade_value(request.getGrade_value());
    grade.setGrade_weight(request.getGrade_weight());
    grade.setComment(request.getComment());

    gradeRepository.save(grade);
    return ResponseEntity.ok(grade);
  }
}
