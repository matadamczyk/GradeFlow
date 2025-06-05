package com.example.demo.dao;

import com.example.demo.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Date;
import java.util.List;

public interface GradeRepository extends JpaRepository<Grade,Integer> {
  List<Grade> findByStudentAndTeacherSubject(Student student, TeacherSubject teacherSubject);

  List<Grade> findByStudent(Student student);

}
