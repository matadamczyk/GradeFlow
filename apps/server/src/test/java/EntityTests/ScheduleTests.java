package EntityTests;

import com.example.demo.entity.Schedule;
import com.example.demo.entity.Timetable;
import org.junit.jupiter.api.Test;

import java.sql.Date;

import static org.junit.jupiter.api.Assertions.*;

public class ScheduleTests {

  @Test
  void testSetAndGetId() {
    Schedule schedule = new Schedule();
    schedule.setId(10);
    assertEquals(10, schedule.getId());
  }

  @Test
  void testSetAndGetLesson() {
    Schedule schedule = new Schedule();
    Timetable lesson = new Timetable();
    schedule.setLesson(lesson);
    assertEquals(lesson, schedule.getLesson());
  }

  @Test
  void testSetAndGetDate() {
    Schedule schedule = new Schedule();
    Date date = Date.valueOf("2025-06-17");
    schedule.setDate(date);
    assertEquals(date, schedule.getDate());
  }

  @Test
  void testSetAndGetTitle() {
    Schedule schedule = new Schedule();
    schedule.setTitle("Matematyka");
    assertEquals("Matematyka", schedule.getTitle());
  }

  @Test
  void testSetAndGetComment() {
    Schedule schedule = new Schedule();
    schedule.setComment("Przynieś podręcznik");
    assertEquals("Przynieś podręcznik", schedule.getComment());
  }

  @Test
  void testConstructorWithAllArgs() {
    Timetable lesson = new Timetable();
    Date date = Date.valueOf("2025-06-18");
    Schedule schedule = new Schedule(1, lesson, date, "Fizyka", "Sesja laboratoryjna");

    assertEquals(1, schedule.getId());
    assertEquals(lesson, schedule.getLesson());
    assertEquals(date, schedule.getDate());
    assertEquals("Fizyka", schedule.getTitle());
    assertEquals("Sesja laboratoryjna", schedule.getComment());
  }
}
