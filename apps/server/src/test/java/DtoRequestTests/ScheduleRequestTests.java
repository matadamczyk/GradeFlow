package DtoRequestTests;

import com.example.demo.dto.ScheduleRequest;
import org.junit.jupiter.api.Test;

import java.sql.Date;

import static org.junit.jupiter.api.Assertions.*;

public class ScheduleRequestTests {

  @Test
  void shouldSetAndGetLessonId() {
    ScheduleRequest request = new ScheduleRequest();
    request.setLessonId(101);
    assertEquals(101, request.getLessonId());
  }

  @Test
  void shouldSetAndGetDate() {
    ScheduleRequest request = new ScheduleRequest();
    Date date = Date.valueOf("2025-06-17");
    request.setDate(date);
    assertEquals(date, request.getDate());
  }

  @Test
  void shouldSetAndGetTitle() {
    ScheduleRequest request = new ScheduleRequest();
    String title = "Kartkówka z matematyki";
    request.setTitle(title);
    assertEquals(title, request.getTitle());
  }

  @Test
  void shouldSetAndGetComment() {
    ScheduleRequest request = new ScheduleRequest();
    String comment = "Dotyczy działu: równania kwadratowe";
    request.setComment(comment);
    assertEquals(comment, request.getComment());
  }
}
