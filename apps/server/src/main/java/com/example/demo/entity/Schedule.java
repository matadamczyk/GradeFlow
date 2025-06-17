package com.example.demo.entity;

import jakarta.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "Schedule")
public class Schedule {

  @Id
  @SequenceGenerator(name = "schedule_sequence", sequenceName = "schedule_sequence", allocationSize = 1)
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "schedule_sequence")
  private Integer id;

  @ManyToOne
  @JoinColumn(name = "lesson_id", nullable = false, foreignKey = @ForeignKey(name = "fk_schedule_timetable"))
  private Timetable lesson;


  @Temporal(TemporalType.DATE)
  @Column(nullable = false)
  private Date date;

  @Column(name = "title",nullable = false, columnDefinition = "TEXT")
  private String title;

  @Column(name = "comment", columnDefinition = "TEXT")
  private String comment;

  public Schedule() {
  }

  public Schedule(Integer id, Timetable lesson, Date date, String title, String comment) {
    this.id = id;
    this.lesson = lesson;
    this.date = date;
    this.title = title;
    this.comment = comment;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
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

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getComment() {
    return comment;
  }

  public void setComment(String comment) {
    this.comment = comment;
  }
}
