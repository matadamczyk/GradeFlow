package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;

import java.sql.Date;

public class GradeRequest {

  @JsonProperty("student_id")
  private Integer studentId;

  @JsonProperty("teacher_subject_id")
  private Integer teacherSubjectId;

  @JsonProperty("lesson_id")
  private Integer lessonId;

  private Date date;

  private Float grade_value;

  private Integer grade_weight;

  public Integer getTeacherSubjectId() {return teacherSubjectId;}

  public void setTeacherSubjectId(Integer teacherSubjectId) {this.teacherSubjectId = teacherSubjectId;}

  public Float getGrade_value() {return grade_value;}

  public void setGrade_value(Float grade_value) {this.grade_value = grade_value;}

  public Integer getGrade_weight() {return grade_weight;}

  public void setGrade_weight(Integer grade_weight) {this.grade_weight = grade_weight;}

  public String getComment() {return comment;}

  public void setComment(String comment) {this.comment = comment;}

  private String comment;

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
