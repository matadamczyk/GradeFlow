package com.example.demo.dao;

import com.example.demo.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TeacherRepository extends JpaRepository<Teacher, Integer> {
  //Zwraca nauczycieli, ktorzy ucza dana klase
  @Query("SELECT DISTINCT t FROM Teacher t " +
    "JOIN TeacherSubject ts ON ts.teacher = t " +
    "JOIN Timetable tb ON tb.teacherSubject = ts " +
    "WHERE tb.studentClass.id = :classId")
  List<Teacher> findTeachersByClassId(@Param("classId") Integer classId);


}
