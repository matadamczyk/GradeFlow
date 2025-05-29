package com.example.demo.dto;

import com.example.demo.entity.WorkDay;
import com.fasterxml.jackson.annotation.JsonProperty;

public class TimetableRequest {

  @JsonProperty("class_id")
  private Integer classId;

  @JsonProperty("teacher_subject_id")
  private Integer teacherSubjectId;

  @JsonProperty("lesson_number")
  private Integer lessonNumber;

  private WorkDay day;

  // getters and setters
  public Integer getClassId() {
    return classId;
  }

  public void setClassId(Integer classId) {
    this.classId = classId;
  }

  public Integer getTeacherSubjectId() {
    return teacherSubjectId;
  }

  public void setTeacherSubjectId(Integer teacherSubjectId) {
    this.teacherSubjectId = teacherSubjectId;
  }

  public Integer getLessonNumber() {
    return lessonNumber;
  }

  public void setLessonNumber(Integer lessonNumber) {
    this.lessonNumber = lessonNumber;
  }

  public WorkDay getDay() {
    return day;
  }

  public void setDay(WorkDay day) {
    this.day = day;
  }
}
