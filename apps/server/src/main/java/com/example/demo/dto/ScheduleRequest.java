package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.Date;

public class ScheduleRequest {

  @JsonProperty("lesson_id")
  private Integer lessonId;

  private Date date;

  private String title;

  private String comment;

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

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getComment() {
    return comment;
  }

  public void setComment(String comment) {
    this.comment = comment;
  }
}
