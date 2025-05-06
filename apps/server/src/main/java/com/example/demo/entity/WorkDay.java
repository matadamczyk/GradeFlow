package com.example.demo.entity;

public enum WorkDay {
  MON("Poniedziałek"),
  TUE("Wtorek"),
  WED("Środa"),
  THU("Czwartek"),
  FRI("Piątek");

  private final String label;

  WorkDay(String label) {
    this.label = label;
  }

  @Override
  public String toString() {
    return label;
  }
}
