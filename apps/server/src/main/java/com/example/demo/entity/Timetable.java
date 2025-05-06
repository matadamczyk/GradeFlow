package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Timetable")
public class Timetable {
  @Id
  @SequenceGenerator(name = "lesson_sequence", sequenceName = "lesson_sequence", allocationSize = 1)
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "lesson_sequence")
  private Integer lesson_id;

  @ManyToOne
  @JoinColumn(name = "class_id",nullable = false,foreignKey = @ForeignKey(name = "fk_timetable_class"))
  private Class studentClass;

  @ManyToOne
  @JoinColumn(name = "teacher_subject_id",nullable = false,foreignKey = @ForeignKey(name = "fk_timetable_teacherSubject"))
  private TeacherSubject teacherSubject;

  @Column(name = "lesson_number", nullable = false,
    columnDefinition = "INTEGER CHECK (lesson_number >= 0 AND lesson_number <= 8)")
  private Integer lesson_number;

  @Enumerated(EnumType.STRING)
  @Column(name = "day",nullable = false)
  private WorkDay day;

  public Integer getLesson_id() {
    return lesson_id;
  }

  public void setLesson_id(Integer lesson_id) {
    this.lesson_id = lesson_id;
  }


  public Integer getLesson_number() {
    return lesson_number;
  }

  public void setLesson_number(Integer lesson_number) {
    this.lesson_number = lesson_number;
  }

  public WorkDay getDay() {
    return day;
  }

  public void setDay(WorkDay day) {
    this.day = day;
  }

  public Class getStudentClass() {
    return studentClass;
  }

  public void setStudentClass(Class studentClass) {
    this.studentClass = studentClass;
  }

  public TeacherSubject getTeacherSubject() {
    return teacherSubject;
  }

  public void setTeacherSubject(TeacherSubject teacherSubject) {
    this.teacherSubject = teacherSubject;
  }
}
