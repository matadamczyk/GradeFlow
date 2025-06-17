package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class StudentRequestTest {

  private String  name= "name1";
  private String lastname = "lastname1";
  private Integer classId =17;
  private Integer userId =13;
  private StudentRequest studentRequest;

  @BeforeEach
  public void setUp() {
    studentRequest = new StudentRequest();
    studentRequest.setName(name);
    studentRequest.setLastname(lastname);
    studentRequest.setClassId(classId);
    studentRequest.setUserId(userId);
  }

  @Test
  public void testSetName() {
    String newName = "newName";
    studentRequest.setName(newName);
    assertEquals(newName, studentRequest.getName());
  }

  @Test
  public void testSetLastname() {
    String newLastname = "newLastname";
    studentRequest.setLastname(newLastname);
    assertEquals(newLastname, studentRequest.getLastname());
  }

  @Test
  public void testSetClassId() {
    Integer newClassId = 18;
    studentRequest.setClassId(newClassId);
    assertEquals(newClassId, studentRequest.getClassId());
  }

  @Test
  public void testSetUserId() {
    Integer newUserId = 11;
    studentRequest.setUserId(newUserId);
    assertEquals(newUserId, studentRequest.getUserId());
  }
}
