package EntityTests;

import com.example.demo.entity.Subject;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class SubjectTests {

  @Test
  void shouldSetAndGetId() {
    Subject subject = new Subject();
    subject.setId(1);
    assertEquals(1, subject.getId());
  }

  @Test
  void shouldSetAndGetName() {
    Subject subject = new Subject();
    subject.setName("Matematyka");
    assertEquals("Matematyka", subject.getName());
  }

  @Test
  void constructorShouldInitializeFields() {
    Subject subject = new Subject(5, "Fizyka");
    assertEquals(5, subject.getId());
    assertEquals("Fizyka", subject.getName());
  }
}
