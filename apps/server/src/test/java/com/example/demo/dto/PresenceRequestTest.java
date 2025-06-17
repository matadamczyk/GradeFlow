package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class PresenceRequestTest {

  private Integer studentId=1;
  private Integer lessonId=10;
  private Date date=Date.valueOf("2010-12-21");
  private PresenceRequest presenceRequest;

  @BeforeEach
  void setUp() {
    presenceRequest=new PresenceRequest();
    presenceRequest.setStudentId(studentId);
    presenceRequest.setLessonId(lessonId);
    presenceRequest.setDate(date);
  }

  @Test
  void getStudentId() {
    assertEquals(studentId,presenceRequest.getStudentId());
  }

  @Test
  void setStudentId() {
    Integer newStudentId=studentId+1;
    presenceRequest.setStudentId(newStudentId);
    assertEquals(newStudentId,presenceRequest.getStudentId());
  }

  @Test
  void getLessonId() {
    assertEquals(lessonId,presenceRequest.getLessonId());
  }

  @Test
  void setLessonId() {
    Integer newLessonId=lessonId+1;
    presenceRequest.setLessonId(newLessonId);
    assertEquals(newLessonId,presenceRequest.getLessonId());
  }

  @Test
  void getDate() {
    assertEquals(date,presenceRequest.getDate());
  }

  @Test
  void setDate() {
    Date newDate=Date.valueOf("2001-12-21");
    presenceRequest.setDate(newDate);
    assertEquals(newDate,presenceRequest.getDate());
  }
}
