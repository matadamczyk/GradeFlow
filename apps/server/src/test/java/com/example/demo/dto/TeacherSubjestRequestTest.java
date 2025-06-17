package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TeacherSubjestRequestTest {
  private Integer teacher_id=11;
  private Integer subject_id=16;
  private TeacherSubjectRequest request;

  @BeforeEach
  public void setUp() {
    request=new TeacherSubjectRequest();
    request.setTeacher_id(teacher_id);
    request.setSubject_id(subject_id);
  }

  @Test
  public void testSetTeacher_id() {
    Integer new_teacher_id=12;
    request.setTeacher_id(new_teacher_id);
    assertEquals(new_teacher_id,request.getTeacher_id());
  }

  @Test
  public void testSetSubject_id() {
    Integer new_subject_id=19;
    request.setSubject_id(new_subject_id);
    assertEquals(new_subject_id,request.getSubject_id());
  }

  @Test
  public void getTeacher_id() {
    assertEquals(teacher_id,request.getTeacher_id());
  }

  @Test
  public void getSubject_id() {
    assertEquals(subject_id,request.getSubject_id());
  }

}
