package com.example.demo.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "Student")
public class Student {

  @Id
  @SequenceGenerator(name = "student_sequence", sequenceName = "student_sequence", allocationSize = 1)
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "student_sequence")
  private Integer id;

  @Column( name = "name", nullable = false)
  private String name;

  @Column( name = "last_name", nullable = false)
  private String lastname;

  @ManyToOne
  @JoinColumn(name = "class_id",nullable = false,foreignKey = @ForeignKey(name = "fk_student_class"))
  private StudentClass studentClass;

  @Column(name = "user_id", nullable = true)
  private Integer userId;

  public Student() {

  }

  public Student(Integer id, String name, String lastname, StudentClass studentClass) {
    this.id = id;
    this.name = name;
    this.lastname = lastname;
    this.studentClass = studentClass;
  }

  public Student(Integer id, String name, String lastname, StudentClass studentClass, Integer userId) {
    this.id = id;
    this.name = name;
    this.lastname = lastname;
    this.studentClass = studentClass;
    this.userId = userId;
  }

  public StudentClass getStudentClass() {
    return studentClass;
  }

  public void setStudentClass(StudentClass studentClass) {
    this.studentClass = studentClass;
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

  public Integer getUserId() {
    return userId;
  }

  public void setUserId(Integer userId) {
    this.userId = userId;
  }

  @Override
  public String toString() {
    return "Student{" +
      "id=" + id +
      ", name='" + name + '\'' +
      ", lastname='" + lastname + '\'' +
      ", class_id=" + studentClass +
      '}';
  }
}
