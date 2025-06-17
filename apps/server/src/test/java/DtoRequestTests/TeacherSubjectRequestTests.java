package DtoRequestTests;

import com.example.demo.dto.TeacherSubjectRequest;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class TeacherSubjectRequestTests {

  @Test
  void shouldSetAndGetTeacherId() {
    TeacherSubjectRequest request = new TeacherSubjectRequest();
    request.setTeacher_id(101);
    assertEquals(101, request.getTeacher_id());
  }

  @Test
  void shouldSetAndGetSubjectId() {
    TeacherSubjectRequest request = new TeacherSubjectRequest();
    request.setSubject_id(202);
    assertEquals(202, request.getSubject_id());
  }
}
