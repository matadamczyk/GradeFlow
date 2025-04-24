package com.example.demo.entity;

import jakarta.persistence.*;

import java.sql.Date;

@Entity
@Table(name = "Presence")
public class Presence {

  @Id
  @SequenceGenerator(name = "presence_sequence", sequenceName = "presence_sequence", allocationSize = 1)
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "presence_sequence")
  private Integer id;

  @ManyToOne
  @JoinColumn(name = "student_id", nullable = false,foreignKey = @ForeignKey(name = "fk_presence_student") )
  private Student student;

  @ManyToOne
  @JoinColumn(name = "lesson_id", nullable = false, foreignKey = @ForeignKey(name = "fk_presence_timetable"))
  private Timetable lesson;

  @Column(name = "date", nullable = false)
  private Date date;

}
