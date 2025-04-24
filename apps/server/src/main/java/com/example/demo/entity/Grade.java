package com.example.demo.entity;

import java.sql.Date;
import jakarta.persistence.*;

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
  @JoinColumn(name = "lesson_id", nullable = false,foreignKey = @ForeignKey(name = "fk_grade_timetable"))
  private Timetable lesson;

  @Temporal(TemporalType.DATE)
  @Column(nullable = false)
  private Date date;

  @Column(name = "grade_value", nullable = false,
    columnDefinition = "FLOAT CHECK (grade_value >= 1.0 AND grade_value <= 6.0)")
  private Float grade_value;

  @Column(name = "grade_weight", nullable = false)
  private Integer grade_weight;

  @Column(name = "comment", columnDefinition = "TEXT")
  private String comment;

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
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

  public void setGrade_weihght(Integer grade_weihght) {
    this.grade_weight = grade_weihght;
  }

  public String getComment() {
    return comment;
  }

  public void setComment(String comment) {
    this.comment = comment;
  }

}
