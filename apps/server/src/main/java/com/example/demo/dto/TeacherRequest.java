package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TeacherRequest {
  private String name;
  private String lastname;

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

}
