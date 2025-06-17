package com.example.demo.entity;

import net.bytebuddy.build.ToStringPlugin;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

public class TeacherSubjectTest {

  private TeacherSubject teacherSubject;
  private final Integer id =4;
  private final Teacher teacher=mock(Teacher.class);
  private final Subject subject=mock(Subject.class);

  @BeforeEach
  public void setUp() {
    teacherSubject = new TeacherSubject(id, teacher, subject);
  }

  @Test
  public void testGetId() {
    assertEquals(id,teacherSubject.getId());
  }

  @Test
  public void testGetTeacher() {
    assertEquals(teacher,teacherSubject.getTeacher());
  }

  @Test
  public void testGetSubject() {
    assertEquals(subject,teacherSubject.getSubject());
  }

  @Test
  public void testSetId() {
    Integer newId =1;
    teacherSubject.setId(newId);
    assertEquals(newId,teacherSubject.getId());
  }

  @Test
  public void testSetTeacher() {
    Teacher newTeacher=mock(Teacher.class);
    teacherSubject.setTeacher(newTeacher);
    assertEquals(newTeacher,teacherSubject.getTeacher());
  }

  @Test
  public void testSetSubject() {
    Subject newSubject=mock(Subject.class);
    teacherSubject.setSubject(newSubject);
    assertEquals(newSubject,teacherSubject.getSubject());
  }

}
