package DtoRequestTests;

import com.example.demo.dto.PresenceRequest;
import org.junit.jupiter.api.Test;

import java.sql.Date;

import static org.junit.jupiter.api.Assertions.*;

public class PresenceRequestTests {

  @Test
  void shouldSetAndGetStudentId() {
    PresenceRequest request = new PresenceRequest();
    request.setStudentId(100);
    assertEquals(100, request.getStudentId());
  }

  @Test
  void shouldSetAndGetLessonId() {
    PresenceRequest request = new PresenceRequest();
    request.setLessonId(200);
    assertEquals(200, request.getLessonId());
  }

  @Test
  void shouldSetAndGetDate() {
    PresenceRequest request = new PresenceRequest();
    Date date = Date.valueOf("2025-06-17");
    request.setDate(date);
    assertEquals(date, request.getDate());
  }
}
