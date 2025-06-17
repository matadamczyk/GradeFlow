package DtoRequestTests;

import com.example.demo.dto.GradeRequest;
import org.junit.jupiter.api.Test;

import java.sql.Date;

import static org.junit.jupiter.api.Assertions.*;

public class GradeRequestTests {

  @Test
  void shouldSetAndGetStudentId() {
    GradeRequest request = new GradeRequest();
    request.setStudentId(1);
    assertEquals(1, request.getStudentId());
  }

  @Test
  void shouldSetAndGetTeacherSubjectId() {
    GradeRequest request = new GradeRequest();
    request.setTeacherSubjectId(2);
    assertEquals(2, request.getTeacherSubjectId());
  }

  @Test
  void shouldSetAndGetLessonId() {
    GradeRequest request = new GradeRequest();
    request.setLessonId(3);
    assertEquals(3, request.getLessonId());
  }

  @Test
  void shouldSetAndGetDate() {
    GradeRequest request = new GradeRequest();
    Date date = Date.valueOf("2025-06-17");
    request.setDate(date);
    assertEquals(date, request.getDate());
  }

  @Test
  void shouldSetAndGetGradeValue() {
    GradeRequest request = new GradeRequest();
    request.setGrade_value(4.5f);
    assertEquals(4.5f, request.getGrade_value());
  }

  @Test
  void shouldSetAndGetGradeWeight() {
    GradeRequest request = new GradeRequest();
    request.setGrade_weight(2);
    assertEquals(2, request.getGrade_weight());
  }

  @Test
  void shouldSetAndGetComment() {
    GradeRequest request = new GradeRequest();
    request.setComment("Dobry wynik");
    assertEquals("Dobry wynik", request.getComment());
  }
}
