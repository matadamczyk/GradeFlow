package DtoRequestTests;

import com.example.demo.dto.StudentClassRequest;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class StudentClassRequestTests {

  @Test
  void shouldSetAndGetNumber() {
    StudentClassRequest request = new StudentClassRequest();
    request.setNumber((byte) 3);
    assertEquals((byte) 3, request.getNumber());
  }

  @Test
  void shouldSetAndGetLetter() {
    StudentClassRequest request = new StudentClassRequest();
    request.setLetter('B');
    assertEquals('B', request.getLetter());
  }

  @Test
  void shouldSetAndGetTutorId() {
    StudentClassRequest request = new StudentClassRequest();
    request.setTutorId(42);
    assertEquals(42, request.getTutorId());
  }
}
