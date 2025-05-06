package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Teacher")
public class Teacher {
  @Id
  @SequenceGenerator(name = "teacher_sequence", sequenceName = "teacher_sequence", allocationSize = 1)
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "teacher_sequence")
  private Integer id;

  @Column( name = "name", nullable = false)
  private String name;

  @Column( name = "last_name", nullable = false)
  private String lastname;

  public Teacher(Integer id, String name, String lastname) {
    this.id = id;
    this.name = name;
    this.lastname = lastname;
  }

  public String getLastname() {
    return lastname;
  }

  public void setLastname(String lastname) {
    this.lastname = lastname;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  @Override
  public String toString() {
    return "Teacher{" +
      "id=" + id +
      ", name='" + name + '\'' +
      ", lastname='" + lastname + '\'' +
      '}';
  }
}
