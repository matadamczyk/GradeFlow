package EntityTests;

import com.example.demo.entity.*;
import org.junit.jupiter.api.Test;

import java.sql.Date;

import static org.junit.jupiter.api.Assertions.*;

public class GradeTests {

  @Test
  void testSetAndGetId() {
    Grade grade = new Grade();
    grade.setId(100);
    assertEquals(100, grade.getId());
  }

  @Test
  void testSetAndGetStudent() {
    Grade grade = new Grade();
    Student student = new Student();
    student.setId(1);
    grade.setStudent(student);
    assertEquals(student, grade.getStudent());
  }

  @Test
  void testSetAndGetTeacherSubject() {
    Grade grade = new Grade();
    TeacherSubject teacherSubject = new TeacherSubject();
    grade.setTeacherSubject(teacherSubject);
    assertEquals(teacherSubject, grade.getTeacherSubject());
  }

  @Test
  void testSetAndGetLesson() {
    Grade grade = new Grade();
    Timetable lesson = new Timetable();
    grade.setLesson(lesson);
    assertEquals(lesson, grade.getLesson());
  }

  @Test
  void testSetAndGetDate() {
    Grade grade = new Grade();
    Date date = Date.valueOf("2024-06-17");
    grade.setDate(date);
    assertEquals(date, grade.getDate());
  }

  @Test
  void testSetAndGetGradeValue() {
    Grade grade = new Grade();
    grade.setGrade_value(5.0f);
    assertEquals(5.0f, grade.getGrade_value());
  }

  @Test
  void testSetAndGetGradeWeight() {
    Grade grade = new Grade();
    grade.setGrade_weight(3);
    assertEquals(3, grade.getGrade_weight());
  }

  @Test
  void testSetAndGetComment() {
    Grade grade = new Grade();
    grade.setComment("Excellent performance");
    assertEquals("Excellent performance", grade.getComment());
  }

  @Test
  void testConstructorWithAllArgs() {
    Student student = new Student();
    TeacherSubject teacherSubject = new TeacherSubject();
    Timetable lesson = new Timetable();
    Date date = Date.valueOf("2024-06-01");

    Grade grade = new Grade(1, student, teacherSubject, lesson, date, 4.5f, 2, "Good work");

    assertEquals(1, grade.getId());
    assertEquals(student, grade.getStudent());
    assertEquals(teacherSubject, grade.getTeacherSubject());
    assertEquals(lesson, grade.getLesson());
    assertEquals(date, grade.getDate());
    assertEquals(4.5f, grade.getGrade_value());
    assertEquals(2, grade.getGrade_weight());
    assertEquals("Good work", grade.getComment());
  }

  @Test
  void testConstructorWithoutId() {
    Student student = new Student();
    TeacherSubject teacherSubject = new TeacherSubject();
    Timetable lesson = new Timetable();
    Date date = Date.valueOf("2024-06-02");

    Grade grade = new Grade(student, teacherSubject, lesson, date, 3.0f, 1, "Needs improvement");

    assertNull(grade.getId());
    assertEquals(student, grade.getStudent());
    assertEquals(teacherSubject, grade.getTeacherSubject());
    assertEquals(lesson, grade.getLesson());
    assertEquals(date, grade.getDate());
    assertEquals(3.0f, grade.getGrade_value());
    assertEquals(1, grade.getGrade_weight());
    assertEquals("Needs improvement", grade.getComment());
  }
}
