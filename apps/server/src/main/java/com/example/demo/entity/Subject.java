package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Subject")
public class Subject {
  @Id
  @SequenceGenerator(name = "subject_sequence", sequenceName = "subject_sequence", allocationSize = 1)
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "subject_sequence")
  private Integer id;

  @Column(name = "subject_name",nullable = false,unique = true)
  private String name;

  public Subject(){

  }

  public Subject(Integer id, String name) {
    this.id = id;
    this.name = name;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}
