package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.sql.Date;

public class PresenceRequest {

  @JsonProperty("student_id")
  private Integer studentId;

  @JsonProperty("lesson_id")
  private Integer lessonId;

  private Date date;

  // getters and setters

  public Integer getStudentId() {
    return studentId;
  }

  public void setStudentId(Integer studentId) {
    this.studentId = studentId;
  }

  public Integer getLessonId() {
    return lessonId;
  }

  public void setLessonId(Integer lessonId) {
    this.lessonId = lessonId;
  }

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }
}
