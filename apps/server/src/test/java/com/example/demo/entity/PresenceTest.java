package com.example.demo.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.sql.Date;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

public class PresenceTest {
  private final Presence presence = new Presence();
  private final Integer id=4;
  private final Student student=mock(Student.class);
  private final Timetable timetable=mock(Timetable.class);
  private final Date date= Date.valueOf("2007-12-03");

  @Test
  public void testPresence() {
    presence.setStudent(student);
    presence.setDate(date);
    presence.setId(id);
    presence.setLesson(timetable);

    assertAll(
      ()->assertEquals(student,presence.getStudent()),
      ()->assertEquals(date,presence.getDate()),
      ()->assertEquals(id,presence.getId()),
      ()->assertEquals(timetable,presence.getLesson())
    );
  }
}
