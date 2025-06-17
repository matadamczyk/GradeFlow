package com.example.demo.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;


import static org.junit.jupiter.api.Assertions.*;

public class TeacherTests {
  private Teacher teacher;
  private final Integer id = 3;
  private final String name = "Name1";
  private final String lastname = "Lastname1";
  private final Integer userId = 10;

  @BeforeEach
  public void setUp() {
    teacher = new Teacher(id, name, lastname);
  }

  @Test
  public void testGetLastname() {
    assertEquals(lastname,teacher.getLastname());
  }

  @Test
  public void testGetName() {
    assertEquals(name,teacher.getName());
  }

  @Test
  public void testGetId() {
    assertEquals(id,teacher.getId());
  }

  @Test
  public void testSetId() {
    Integer newId = 4;
    teacher.setId(newId);
    assertEquals(newId,teacher.getId());
  }

  @Test
  public void testSetName() {
    String newName = "Name2";
    teacher.setName(newName);
    assertEquals(newName,teacher.getName());
  }

  @Test
  public void testSetLastname() {
    String newLastname = "Lastname2";
    teacher.setLastname(newLastname);
    assertEquals(newLastname,teacher.getLastname());
  }

  @Test
  public void testToString() {
    String str = "Teacher{" +
      "id=" + id +
      ", name='" + name + '\'' +
      ", lastname='" + lastname + '\'' +
      '}';
    assertEquals(str,teacher.toString());
  }

  @Test
  public void testSetUserId() {
    Integer newId = 4;
    teacher.setUserId(newId);
    assertEquals(newId,teacher.getUserId());
  }

  @Test
  public void testGetUserId() {
    teacher.setUserId(userId);
    assertEquals(userId,teacher.getUserId());
  }

  @Test
  public void testDefaultConstructor() {
    Teacher emptyTeacher = new Teacher();
    assertAll(
      ()->assertNull(emptyTeacher.getId()),
      ()->assertNull(emptyTeacher.getLastname()),
      ()->assertNull(emptyTeacher.getName()),
      ()->assertNull(emptyTeacher.getUserId())
    );
  }
}
