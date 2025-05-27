package com.example.demo.dto;

public class ClassRequest {
  private Byte number;
  private Character letter;
  private Integer tutorId;

  // Getters and Setters

  public Byte getNumber() {
    return number;
  }

  public void setNumber(Byte number) {
    this.number = number;
  }

  public Character getLetter() {
    return letter;
  }

  public void setLetter(Character letter) {
    this.letter = letter;
  }

  public Integer getTutorId() {
    return tutorId;
  }

  public void setTutorId(Integer tutorId) {
    this.tutorId = tutorId;
  }
}
