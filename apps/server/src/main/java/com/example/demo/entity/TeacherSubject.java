package com.example.demo.entity;

import jakarta.persistence.*;


@Entity
@Table(
  name = "teacher_subject",
  uniqueConstraints = {
    @UniqueConstraint(columnNames = {"teacher_id", "subject_id"})
  }
)
public class TeacherSubject {

  @Id
  @SequenceGenerator(name = "teacher_subject_sequence", sequenceName = "teacher_subject_sequence", allocationSize = 1)
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "teacher_subject_sequence")
  private Integer id;

  public TeacherSubject() {
  }

  public TeacherSubject(Integer id, Teacher teacher, Subject subject) {
    this.id = id;
    this.teacher = teacher;
    this.subject = subject;
  }

  @ManyToOne
  @JoinColumn(name = "teacher_id", nullable = false, foreignKey = @ForeignKey(name = "fk_teacherSubject_teacher"))
  private Teacher teacher;

  @ManyToOne
  @JoinColumn(name = "subject_id", nullable = false, foreignKey = @ForeignKey(name = "fk_teacherSubject_subject"))
  private Subject subject;

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }


  public Teacher getTeacher() {
    return teacher;
  }

  public void setTeacher(Teacher teacher) {
    this.teacher = teacher;
  }

  public Subject getSubject() {
    return subject;
  }

  public void setSubject(Subject subject) {
    this.subject = subject;
  }
}
