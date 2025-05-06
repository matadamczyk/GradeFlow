package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Class",
  uniqueConstraints = { @UniqueConstraint(columnNames = {"number", "letter"})
})
public class Class {
  @Id
  @SequenceGenerator(name = "class_sequence", sequenceName = "class_sequence", allocationSize = 1)
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "class_sequence")
  private Integer id;

  @Column(name = "letter",nullable = false)
  private Character letter;

  @Column(name = "number", nullable = false,
    columnDefinition = "INTEGER CHECK (number >= 1 AND number <= 4)")
  private Byte number;

  @OneToOne
  @JoinColumn(name = "tutor_id",nullable = false,unique = true, foreignKey = @ForeignKey(name = "fk_class_teacher"))
  private Teacher tutor;

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public Character getLetter() {
    return letter;
  }

  public void setLetter(Character letter) {
    this.letter = letter;
  }

  public Byte getNumber() {
    return number;
  }

  public void setNumber(Byte number) {
    this.number = number;
  }

  public String getClassName(){
    return "" + getNumber() + getLetter();
  }

  public void setClassName(Character letter,Byte number){
    setNumber(number);
    setLetter(letter);
  }


  public Teacher getTutor() {
    return tutor;
  }

  public void setTutor(Teacher tutor) {
    this.tutor = tutor;
  }
}
