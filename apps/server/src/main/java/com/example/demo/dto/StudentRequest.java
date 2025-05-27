package com.example.demo.dto;

public class StudentRequest {
  private String name;
  private String lastname;
  private Integer classid;

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

  public Integer getClassid() {
    return classid;
  }

  public void setClassid(Integer classid) {
    this.classid = classid;
  }
}
