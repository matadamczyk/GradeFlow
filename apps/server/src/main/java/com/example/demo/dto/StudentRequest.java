package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class StudentRequest {
  private String name;
  private String lastname;

  @JsonProperty("class_id")
  private Integer classId;

  @JsonProperty("user_id")
  private Integer userId;

  // getters and setters

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getLastname() {
    return lastname;
  }

  public void setLastname(String lastname) {
    this.lastname = lastname;
  }

  public Integer getClassId() {
    return classId;
  }

  public void setClassId(Integer classId) {
    this.classId = classId;
  }

  public Integer getUserId() {
    return userId;
  }

  public void setUserId(Integer userId) {
    this.userId = userId;
  }
}
