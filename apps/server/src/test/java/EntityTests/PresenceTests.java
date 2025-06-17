package EntityTests;

import com.example.demo.entity.Presence;
import com.example.demo.entity.Student;
import com.example.demo.entity.Timetable;
import org.junit.jupiter.api.Test;

import java.sql.Date;

import static org.junit.jupiter.api.Assertions.*;

public class PresenceTests {

  @Test
  void shouldSetAndGetId() {
    Presence presence = new Presence();
    presence.setId(5);
    assertEquals(5, presence.getId());
  }

  @Test
  void shouldSetAndGetStudent() {
    Presence presence = new Presence();
    Student student = new Student();
    presence.setStudent(student);
    assertEquals(student, presence.getStudent());
  }

  @Test
  void shouldSetAndGetLesson() {
    Presence presence = new Presence();
    Timetable lesson = new Timetable();
    presence.setLesson(lesson);
    assertEquals(lesson, presence.getLesson());
  }

  @Test
  void shouldSetAndGetDate() {
    Presence presence = new Presence();
    Date date = Date.valueOf("2025-06-17");
    presence.setDate(date);
    assertEquals(date, presence.getDate());
  }
}
