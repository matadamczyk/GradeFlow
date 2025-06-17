package com.example.demo.dto;

import com.example.demo.entity.WorkDay;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TimeTableRequestTest {
  private Integer classId =22;
  private Integer teacherSubjectId=3;
  private Integer lessonNumber=14;
  private WorkDay day = WorkDay.FRI;
  TimetableRequest request;

  @BeforeEach
  public void setUp() {
    request = new TimetableRequest();
    request.setClassId(classId);
    request.setTeacherSubjectId(teacherSubjectId);
    request.setLessonNumber(lessonNumber);
    request.setDay(day);
  }

  @Test
  public void testGetClassId() {
    assertEquals(classId, request.getClassId());
  }

  @Test
  public void testGetTeacherSubjectId() {
    assertEquals(teacherSubjectId, request.getTeacherSubjectId());
  }

  @Test
  public void testGetLessonNumber() {
    assertEquals(lessonNumber, request.getLessonNumber());
  }

  @Test
  public void testGetDay() {
    assertEquals(day, request.getDay());
  }


  @Test
  public void testSetDay() {
    WorkDay newDay = WorkDay.THU;
    request.setDay(newDay);
    assertEquals(newDay, request.getDay());
  }

  @Test
  public void testSetLessonNumber() {
    Integer newLessonNumber = 15;
    request.setLessonNumber(newLessonNumber);
    assertEquals(newLessonNumber, request.getLessonNumber());
  }

  @Test
  public void testsetClassId() {
    Integer newClassId = 20;
    request.setClassId(newClassId);
    assertEquals(newClassId, request.getClassId());
  }

  @Test
  public void testsetTeacherSubjectId() {
    Integer newTeacherSubjectId = 15;
    request.setTeacherSubjectId(newTeacherSubjectId);
    assertEquals(newTeacherSubjectId, request.getTeacherSubjectId());
  }

}
