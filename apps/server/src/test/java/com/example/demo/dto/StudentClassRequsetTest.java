package com.example.demo.dto;

import com.example.demo.entity.StudentClass;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class StudentClassRequsetTest {
  private Byte number =11;
  private Character letter = 'F';
  private Integer tutorId = 15;
  private StudentClassRequest studentClassRequest;

  @BeforeEach
  void setUp() {
    studentClassRequest = new StudentClassRequest();
    studentClassRequest.setTutorId(tutorId);
    studentClassRequest.setNumber(number);
    studentClassRequest.setLetter(letter);
  }

  @Test
  void getNumber() {
    assertEquals(number, studentClassRequest.getNumber());
  }

  @Test
  void setNumber() {
    Byte newNumber = 123;
    studentClassRequest.setNumber(newNumber);
    assertEquals(newNumber, studentClassRequest.getNumber());
  }

  @Test
  void getLetter() {
    assertEquals(letter, studentClassRequest.getLetter());
  }

  @Test
  void setLetter() {
    Character newLetter = 'B';
    studentClassRequest.setLetter(newLetter);
    assertEquals(newLetter, studentClassRequest.getLetter());
  }

  @Test
  void getTutorId() {
    assertEquals(tutorId, studentClassRequest.getTutorId());
  }

  @Test
  void setTutorId() {
    Integer newTutorId = 12;
    studentClassRequest.setTutorId(newTutorId);
    assertEquals(newTutorId, studentClassRequest.getTutorId());
  }

}
