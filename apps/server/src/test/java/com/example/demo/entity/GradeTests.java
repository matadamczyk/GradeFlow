package com.example.demo.entity;

import io.github.cdimascio.dotenv.Dotenv;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.sql.Date;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;


public class GradeTests {

  private Grade grade;
  private final Integer id = 105;
  private final Student student = mock(Student.class);
  private final TeacherSubject teacherSubject = mock(TeacherSubject.class);
  private final Timetable lesson = mock(Timetable.class);
  private final Date date = Date.valueOf("2007-12-03");
  private final Float grade_value = 0.5f;
  private final Integer grade_weight = 5;
  private final String comment = "This is a comment";

  @BeforeEach
  public void setUp() {
    grade = new Grade(id, student, teacherSubject, lesson, date, grade_value, grade_weight, comment);
  }

  @Test
  public void TestConstructorIfSet() {
    assertAll(
      ()->assertEquals(id, grade.getId()),
      ()->assertEquals(student, grade.getStudent()),
      ()->assertEquals(teacherSubject, grade.getTeacherSubject()),
      ()->assertEquals(lesson, grade.getLesson()),
      ()->assertEquals(date, grade.getDate()),
      ()->assertEquals(grade_value, grade.getGrade_value()),
      ()->assertEquals(grade_weight, grade.getGrade_weight()),
      ()->assertEquals(comment, grade.getComment())
    );
  }

  @Test
  public void TestGetID() {
    assertEquals(id, grade.getId());
    Grade grade2 = new Grade();
    assertNull(grade2.getId());
  }

  @Test
  public void TestSetID() {
    Integer newID = 10;
    grade.setId(newID);
    assertEquals(newID, grade.getId());
  }

  @Test
  public void TestGetStudent() {
    assertEquals(student, grade.getStudent());
  }

  @Test
  public void TestSetStudent() {
    Student newStudent = mock(Student.class);
    grade.setStudent(newStudent);
    assertEquals(newStudent, grade.getStudent());
  }

  @Test
  public void TestGetTeacherSubject() {
    assertEquals(teacherSubject, grade.getTeacherSubject());
  }

  @Test
  public void TestSetTeacherSubject() {
    TeacherSubject newTeacherSubject = mock(TeacherSubject.class);
    grade.setTeacherSubject(newTeacherSubject);
    assertEquals(newTeacherSubject, grade.getTeacherSubject());
  }

  @Test
  public void TestGetLesson() {
    assertEquals(lesson, grade.getLesson());
  }

  @Test
  public void TestSetLesson() {
    Timetable newLesson = mock(Timetable.class);
    grade.setLesson(newLesson);
    assertEquals(newLesson, grade.getLesson());
  }

  @Test
  public void TestGetDate() {
    assertEquals(date, grade.getDate());
  }

  @Test
  public void TestSetDate() {
    Date newDate = Date.valueOf("2016-12-03");
    grade.setDate(newDate);
    assertEquals(newDate, grade.getDate());
  }

  @Test
  public void TestGetGradeValue() {
    assertEquals(grade_value,grade.getGrade_value());
  }

  @Test
  public void TestSetGradeValue() {
    Float newGradeValue = 0.7f;
    grade.setGrade_value(newGradeValue);
    assertEquals(newGradeValue, grade.getGrade_value());
  }

  @Test
  public void TestGetGradeWeight() {
    assertEquals(grade_weight, grade.getGrade_weight());
  }

  @Test
  public void TestSetGradeWeight() {
    Integer newGradeWeight = 15;
    grade.setGrade_weight(newGradeWeight);
    assertEquals(newGradeWeight, grade.getGrade_weight());
  }

  @Test
  public void TestGetComment() {
    assertEquals(comment, grade.getComment());
  }

  @Test
  public void TestSetComment() {
    String newComment = "This is another comment";
    grade.setComment(newComment);
    assertEquals(newComment, grade.getComment());
  }
}



