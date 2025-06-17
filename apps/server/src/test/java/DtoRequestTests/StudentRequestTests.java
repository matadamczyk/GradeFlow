package DtoRequestTests;

import com.example.demo.dto.StudentRequest;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class StudentRequestTests {

  @Test
  void shouldSetAndGetName() {
    StudentRequest request = new StudentRequest();
    String name = "Jan";
    request.setName(name);
    assertEquals(name, request.getName());
  }

  @Test
  void shouldSetAndGetLastname() {
    StudentRequest request = new StudentRequest();
    String lastname = "Kowalski";
    request.setLastname(lastname);
    assertEquals(lastname, request.getLastname());
  }

  @Test
  void shouldSetAndGetClassId() {
    StudentRequest request = new StudentRequest();
    Integer classId = 101;
    request.setClassId(classId);
    assertEquals(classId, request.getClassId());
  }

  @Test
  void shouldSetAndGetUserId() {
    StudentRequest request = new StudentRequest();
    Integer userId = 202;
    request.setUserId(userId);
    assertEquals(userId, request.getUserId());
  }
}
