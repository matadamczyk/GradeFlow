package com.example.demo.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

public class TimetableTest {
  private Timetable timetable;
  private final Integer id = 4;
  private final StudentClass student = mock(StudentClass.class);
  private final TeacherSubject subject = mock(TeacherSubject.class);
  private final Integer lesson_number = 2;
  private final WorkDay workday = mock(WorkDay.class);

  @BeforeEach
  public void setUp() {
    timetable = new Timetable(id, student, subject, lesson_number, workday);
  }

  @Test
  public void TestGetLessonId() {
    assertEquals(id,timetable.getLesson_id());
  }

  @Test
  public void TestGetLessonNumber() {
    assertEquals(lesson_number,timetable.getLesson_number());
  }

  @Test
  public void TestGetWorkDay() {
    assertEquals(workday,timetable.getDay());
  }

  @Test
  public void TestGetStudentClass() {
    assertEquals(student,timetable.getStudentClass());
  }

  @Test
  public void TestGetTeacherSubject() {
    assertEquals(subject,timetable.getTeacherSubject());
  }
  //
  @Test
  public void TestSetLessonId() {
    Integer newId=5;
    timetable.setLesson_id(newId);
    assertEquals(newId,timetable.getLesson_id());
  }

  @Test
  public void TestSetLessonNumber() {
    Integer newLessonNuber=5;
    timetable.setLesson_number(newLessonNuber);
    assertEquals(newLessonNuber,timetable.getLesson_number());
  }

  @Test
  public void TestSetWorkDay() {
    WorkDay newWorkDay=mock(WorkDay.class);
    timetable.setDay(newWorkDay);
    assertEquals(newWorkDay,timetable.getDay());
  }

  @Test
  public void TestSetStudentClass() {
    StudentClass newStudentClass=mock(StudentClass.class);
    timetable.setStudentClass(newStudentClass);
    assertEquals(newStudentClass,timetable.getStudentClass());
  }

  @Test
  public void TestSetTeacherSubject() {
    TeacherSubject newTeacherSubject=mock(TeacherSubject.class);
    timetable.setTeacherSubject(newTeacherSubject);
    assertEquals(newTeacherSubject,timetable.getTeacherSubject());
  }
}
