package com.example.demo.entity;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

public class StudentTest {

  private Student student;
  private final Integer studentId = 8;
  private final String name = "name1";
  private final String lastName = "lastname1";
  private final StudentClass studentClass = mock(StudentClass.class);
  private final Integer userId = 10;

  @BeforeEach
  public void setUp() {
    student = new Student(studentId, name, lastName, studentClass);
  }

  @Test
  public void testGetStudentId() {
    assertEquals(studentId, student.getId());
  }

  @Test
  public void testGetName() {
    assertEquals(name, student.getName());
  }

  @Test
  public void testGetLastName() {
    assertEquals(lastName, student.getLastname());
  }

  @Test
  public void testGetStudentClass() {
    assertEquals(studentClass, student.getStudentClass());
  }

  @Test
  public void testSetStudentId() {
    Integer newStudentId = 7;
    student.setId(newStudentId);
    assertEquals(newStudentId, student.getId());
  }

  @Test
  public void testSetName() {
    String newName = "newName";
    student.setName(newName);
    assertEquals(newName, student.getName());
  }

  @Test
  public void testSetLastName() {
    String newLastName = "newLastName";
    student.setLastname(newLastName);
    assertEquals(newLastName, student.getLastname());
  }

  @Test
  public void testSetStudentClass() {
    StudentClass newStudentClass = mock(StudentClass.class);
    student.setStudentClass(newStudentClass);
    assertEquals(newStudentClass, student.getStudentClass());
  }

  @Test
  public void testSetUserID()
  {
    student.setUserId(userId);
    assertEquals(userId, student.getUserId());
  }

  @Test
  public void getUserID()
  {
    Student stud= new Student(studentId, name, lastName, studentClass, userId);
    assertAll(
      ()->assertEquals(userId, stud.getUserId()),
      ()->assertNull(student.getUserId())
    );
  }

  @Test
  public void testDefaultConstructor()
  {
    Student emptyStud = new Student();
    assertAll(
      ()->assertNull(emptyStud.getUserId()),
      ()->assertNull(emptyStud.getId()),
      ()->assertNull(emptyStud.getLastname()),
      ()->assertNull(emptyStud.getName()),
      ()->assertNull(emptyStud.getStudentClass())
    );
  }

  @Test
  public void testToString() {
    String str = "Student{" +
      "id=" + studentId +
      ", name='" + name + '\'' +
      ", lastname='" + lastName + '\'' +
      ", class_id=" + studentClass +
      '}';
    assertEquals(str, student.toString());
  }

}


