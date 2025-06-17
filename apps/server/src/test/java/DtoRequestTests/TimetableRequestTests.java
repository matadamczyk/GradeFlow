package DtoRequestTests;

import com.example.demo.dto.TimetableRequest;
import com.example.demo.entity.WorkDay;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class TimetableRequestTests {

  @Test
  void shouldSetAndGetClassId() {
    TimetableRequest request = new TimetableRequest();
    request.setClassId(1);
    assertEquals(1, request.getClassId());
  }

  @Test
  void shouldSetAndGetTeacherSubjectId() {
    TimetableRequest request = new TimetableRequest();
    request.setTeacherSubjectId(2);
    assertEquals(2, request.getTeacherSubjectId());
  }

  @Test
  void shouldSetAndGetLessonNumber() {
    TimetableRequest request = new TimetableRequest();
    request.setLessonNumber(3);
    assertEquals(3, request.getLessonNumber());
  }

  @Test
  void shouldSetAndGetDay() {
    TimetableRequest request = new TimetableRequest();
    WorkDay day = WorkDay.WED;
    request.setDay(day);
    assertEquals(day, request.getDay());
  }
}
