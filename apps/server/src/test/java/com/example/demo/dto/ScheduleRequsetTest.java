package com.example.demo.dto;

import jakarta.persistence.criteria.CriteriaBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.sql.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ScheduleRequsetTest {

  private Integer lessonId=11;
  private Date date=Date.valueOf("2021-12-21");
  private String title ="test title";
  private String comment ="test comment";
  private ScheduleRequest scheduleRequest;

  @BeforeEach
  public void setUp(){
    scheduleRequest= new ScheduleRequest();
    scheduleRequest.setLessonId(lessonId);
    scheduleRequest.setDate(date);
    scheduleRequest.setTitle(title);
    scheduleRequest.setComment(comment);
  }

  @Test
  public void testSetLessonId(){
    Integer newLessonId=22;
    scheduleRequest.setLessonId(newLessonId);
    assertEquals(newLessonId,scheduleRequest.getLessonId());
  }

  @Test
  public void testSetDate(){
    Date newDate=Date.valueOf("2022-12-21");
    scheduleRequest.setDate(newDate);
    assertEquals(newDate,scheduleRequest.getDate());
  }

  @Test
  public void testSetTitle(){
    String newTitle="new  title";
    scheduleRequest.setTitle(newTitle);
    assertEquals(newTitle,scheduleRequest.getTitle());
  }

  @Test
  public void testSetComment(){
    String newComment="new  comment";
    scheduleRequest.setComment(newComment);
    assertEquals(newComment,scheduleRequest.getComment());
  }
}
