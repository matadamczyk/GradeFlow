package com.example.demo.dto;

public class TeacherRequest {
  private Integer teacher_id;
  private Integer subject_id;

  // Getters and setters

  public Integer getTeacher_id() {
    return teacher_id;
  }

  public void setTeacher_id(Integer teacher_id) {
    this.teacher_id = teacher_id;
  }

  public Integer getSubject_id() {
    return subject_id;
  }

  public void setSubject_id(Integer subject_id) {
    this.subject_id = subject_id;
  }
}
