package com.example.demo.dto;

import com.example.demo.entity.Grade;
import com.example.demo.entity.Role;
import com.example.demo.rest.UserController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

import java.sql.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class GradeRequestTest {

  private Integer studentId=1;
  private Integer teacherSubjectId=10;
  private Integer lessonId=15;
  private Date date = Date.valueOf("2010-12-17");;
  private Float grade_value = 2.3f;
  private Integer grade_weight = 3;
  private GradeRequest gradeRequest;
  private String comment = "comment";

  @BeforeEach
  public void setUp() {
    gradeRequest=new GradeRequest();
    gradeRequest.setStudentId(studentId);
    gradeRequest.setTeacherSubjectId(teacherSubjectId);
    gradeRequest.setLessonId(lessonId);
    gradeRequest.setDate(date);
    gradeRequest.setGrade_value(grade_value);
    gradeRequest.setGrade_weight(grade_weight);
    gradeRequest.setComment(comment);
  }

  @Test
  public void testGetTeacherSubjectId() {
    assertEquals(teacherSubjectId, gradeRequest.getTeacherSubjectId());
  }

  @Test
  public void testGetStudentId() {
    assertEquals(studentId, gradeRequest.getStudentId());
  }

  @Test
  public void testGetLessonId() {
    assertEquals(lessonId, gradeRequest.getLessonId());
  }

  @Test
  public void testGetDate() {
    assertEquals(date, gradeRequest.getDate());
  }

  @Test
  public void testGetGradeValue() {
    assertEquals(grade_value, gradeRequest.getGrade_value());
  }

  @Test
  public void testGetGradeWeight() {
    assertEquals(grade_weight, gradeRequest.getGrade_weight());
  }

  @Test
  public void testSetStudentId() {
    Integer newStudentId=studentId+1;
    gradeRequest.setStudentId(newStudentId);
    assertEquals(newStudentId, gradeRequest.getStudentId());
  }

  @Test
  public void testSetTeacherSubjectId() {
    Integer newTeacherSubjectId=teacherSubjectId+1;
    gradeRequest.setTeacherSubjectId(newTeacherSubjectId);
    assertEquals(newTeacherSubjectId, gradeRequest.getTeacherSubjectId());
  }

  @Test
  public void testSetLessonId() {
    Integer newLessonId=lessonId+1;
    gradeRequest.setLessonId(newLessonId);
    assertEquals(newLessonId, gradeRequest.getLessonId());
  }

  @Test
  public void testSetDate() {
    Date date=Date.valueOf("2011-12-17");
    gradeRequest.setDate(date);
    assertEquals(date, gradeRequest.getDate());
  }

  @Test
  public void testSetGradeValue() {
    Float newGradeValue=2.0f;
    gradeRequest.setGrade_value(newGradeValue);
    assertEquals(newGradeValue, gradeRequest.getGrade_value());
  }

  @Test
  public void testSetGradeWeight() {
    Integer newGradeWeight=5;
    gradeRequest.setGrade_weight(newGradeWeight);
    assertEquals(newGradeWeight, gradeRequest.getGrade_weight());
  }

  @Test
  public void testSetComment() {
    String newComment="new comment";
    gradeRequest.setComment(newComment);
    assertEquals(newComment, gradeRequest.getComment());
  }

  @Test
  public void testGetComment() {
    assertEquals(comment, gradeRequest.getComment());
  }
}
