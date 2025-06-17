package com.example.demo.entity;

import jakarta.persistence.*;

import java.sql.Date;

@Entity
@Table(name = "Grade")
public class Grade {
  @Id
  @SequenceGenerator(name = "grade_sequence", sequenceName = "grade_sequence", allocationSize = 1)
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "grade_sequence")
  private Integer id;

  @ManyToOne
  @JoinColumn(name = "student_id", nullable = false, foreignKey = @ForeignKey(name = "fk_grade_student"))
  private Student student;

  @ManyToOne
  @JoinColumn(name = "teacher_subject_id", nullable = false, foreignKey = @ForeignKey(name = "fk_grade_teacherSubject"))
  private TeacherSubject teacherSubject;

  @ManyToOne
  @JoinColumn(name = "lesson_id", nullable = false, foreignKey = @ForeignKey(name = "fk_grade_timetable"))
  private Timetable lesson;

  @Temporal(TemporalType.DATE)
  @Column(nullable = false)
  private Date date;

  @Column(name = "grade_value", nullable = false,
    columnDefinition = "FLOAT CHECK ((grade_value >= 1.0 AND grade_value <= 6.0) OR grade_value = 0.0)")
  private Float grade_value;

  @Column(name = "grade_weight", nullable = false)
  private Integer grade_weight;

  @Column(name = "comment", columnDefinition = "TEXT")
  private String comment;

  public Grade() {
  }

  public Grade(Integer id, Student student, TeacherSubject teacherSubject, Timetable lesson, Date date, Float grade_value, Integer grade_weight, String comment) {
    this.id = id;
    this.student = student;
    this.teacherSubject = teacherSubject;
    this.lesson = lesson;
    this.date = date;
    this.grade_value = grade_value;
    this.grade_weight = grade_weight;
    this.comment = comment;
  }

  public Grade(Student student, TeacherSubject teacherSubject, Timetable lesson, Date date, Float grade_value, Integer grade_weight, String comment) {
    this.student = student;
    this.teacherSubject = teacherSubject;
    this.lesson = lesson;
    this.date = date;
    this.grade_value = grade_value;
    this.grade_weight = grade_weight;
    this.comment = comment;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public Student getStudent() {
    return student;
  }

  public void setStudent(Student student) {
    this.student = student;
  }

  public TeacherSubject getTeacherSubject() {
    return teacherSubject;
  }

  public void setTeacherSubject(TeacherSubject teacherSubject) {
    this.teacherSubject = teacherSubject;
  }

  public Timetable getLesson() {
    return lesson;
  }

  public void setLesson(Timetable lesson) {
    this.lesson = lesson;
  }

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }

  public Float getGrade_value() {
    return grade_value;
  }

  public void setGrade_value(Float grade_value) {
    this.grade_value = grade_value;
  }

  public Integer getGrade_weight() {
    return grade_weight;
  }

  public void setGrade_weight(Integer grade_weight) {
    this.grade_weight = grade_weight;
  }

  public String getComment() {
    return comment;
  }

  public void setComment(String comment) {
    this.comment = comment;
  }
}
