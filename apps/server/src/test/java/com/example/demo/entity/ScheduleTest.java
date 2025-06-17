package com.example.demo.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;


import java.sql.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

public class ScheduleTest {
  private Schedule schedule;
  private final Integer id = 2;
  private final Timetable timatable = mock(Timetable.class);
  private final Date date = Date.valueOf("2007-12-07");
  private final String title = "Schedule Test";
  private final String comment = "Schedule Test";

  @BeforeEach
  public void setUp() {
    schedule = new Schedule(id, timatable, date, title, comment);
  }

  @Test
  public void testSetId() {
    Integer newId = 18;
    schedule.setId(newId);
    assertEquals(newId, schedule.getId());
  }

  @Test
  public void testGetId() {
    assertEquals(id, schedule.getId());
  }

  @Test
  public void testGetLesson() {
    assertEquals(timatable, schedule.getLesson());
  }

  @Test
  public void testSetLesson() {
    Timetable newLesson = mock(Timetable.class);
    schedule.setLesson(newLesson);
    assertEquals(newLesson, schedule.getLesson());
  }

  @Test
  public void testGetDate() {
    assertEquals(date, schedule.getDate());
  }

  @Test
  public void testSetDate() {
    Date newDate = Date.valueOf("2010-12-07");
    schedule.setDate(newDate);
    assertEquals(newDate, schedule.getDate());
  }

  @Test
  public void testGetTitle() {
    assertEquals(title, schedule.getTitle());
  }

  @Test
  public void testSetTitle() {
    String newTitle = "Schedule Test new title";
    schedule.setTitle(newTitle);
    assertEquals(newTitle, schedule.getTitle());
  }

  @Test
  public void testGetComment() {
    assertEquals(comment, schedule.getComment());
  }

  @Test
  public void testSetComment() {
    String newComment = "Schedule Test new comment";
    schedule.setComment(newComment);
    assertEquals(newComment, schedule.getComment());
  }

  @Test
  public void testDefaultConstructor() {
    Schedule emptySchedule = new Schedule();
    assertAll(
      ()->assertNotNull(schedule),
      ()->assertNull(emptySchedule.getId()),
      ()->assertNull(emptySchedule.getLesson()),
      ()->assertNull(emptySchedule.getDate()),
      ()->assertNull(emptySchedule.getComment()),
      ()->assertNull(emptySchedule.getTitle())
    );

  }
}
