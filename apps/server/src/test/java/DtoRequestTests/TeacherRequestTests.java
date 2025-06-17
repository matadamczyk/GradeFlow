package DtoRequestTests;

import com.example.demo.dto.TeacherRequest;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class TeacherRequestTests {

  @Test
  void shouldSetAndGetName() {
    TeacherRequest request = new TeacherRequest();
    request.setName("Jan");
    assertEquals("Jan", request.getName());
  }

  @Test
  void shouldSetAndGetLastname() {
    TeacherRequest request = new TeacherRequest();
    request.setLastname("Kowalski");
    assertEquals("Kowalski", request.getLastname());
  }
}
