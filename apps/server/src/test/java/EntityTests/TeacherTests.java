package EntityTests;

import com.example.demo.entity.Teacher;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class TeacherTests {

  @Test
  void testSetAndGetId() {
    Teacher teacher = new Teacher();
    teacher.setId(1);
    assertEquals(1, teacher.getId());
  }

  @Test
  void testSetAndGetName() {
    Teacher teacher = new Teacher();
    teacher.setName("Jan");
    assertEquals("Jan", teacher.getName());
  }

  @Test
  void testSetAndGetLastname() {
    Teacher teacher = new Teacher();
    teacher.setLastname("Kowalski");
    assertEquals("Kowalski", teacher.getLastname());
  }

  @Test
  void testSetAndGetUserId() {
    Teacher teacher = new Teacher();
    teacher.setUserId(101);
    assertEquals(101, teacher.getUserId());
  }

  @Test
  void testConstructorWithoutUserId() {
    Teacher teacher = new Teacher(2, "Anna", "Nowak");

    assertEquals(2, teacher.getId());
    assertEquals("Anna", teacher.getName());
    assertEquals("Nowak", teacher.getLastname());
    assertNull(teacher.getUserId());
  }

  @Test
  void testToStringIncludesFields() {
    Teacher teacher = new Teacher(3, "Marek", "Wiśniewski");
    String result = teacher.toString();

    assertTrue(result.contains("id=3"));
    assertTrue(result.contains("name='Marek'"));
    assertTrue(result.contains("lastname='Wiśniewski'"));
  }
}
