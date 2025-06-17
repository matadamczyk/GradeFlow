package com.example.demo.dto;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TeacherRequestTest {
  private String name="name1";
  private String lastname="lastname1";
  private TeacherRequest teacherRequest;

  @BeforeEach
  public void setUp() {
    teacherRequest = new TeacherRequest();
    teacherRequest.setName(name);
    teacherRequest.setLastname(lastname);
  }

  @Test
  public void testSetName() {
    String newName="newName";
    teacherRequest.setName(newName);
    assertEquals(newName, teacherRequest.getName());
  }

  @Test
  public void testSetLastname() {
    String newLastname="newLastname";
    teacherRequest.setLastname(newLastname);
    assertEquals(newLastname, teacherRequest.getLastname());
  }

  @Test
  public void testGetLastname() {
    assertEquals(lastname, teacherRequest.getLastname());
  }

  @Test
  public void testGetName() {
    assertEquals(name, teacherRequest.getName());
  }
}
