package EntityTests;

import com.example.demo.entity.Student;
import com.example.demo.entity.StudentClass;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class StudentTests {

  @Test
  void testSetAndGetId() {
    Student student = new Student();
    student.setId(100);
    assertEquals(100, student.getId());
  }

  @Test
  void testSetAndGetName() {
    Student student = new Student();
    student.setName("Jan");
    assertEquals("Jan", student.getName());
  }

  @Test
  void testSetAndGetLastname() {
    Student student = new Student();
    student.setLastname("Kowalski");
    assertEquals("Kowalski", student.getLastname());
  }

  @Test
  void testSetAndGetUserId() {
    Student student = new Student();
    student.setUserId(42);
    assertEquals(42, student.getUserId());
  }

  @Test
  void testSetAndGetStudentClass() {
    Student student = new Student();
    StudentClass studentClass = new StudentClass();
    student.setStudentClass(studentClass);
    assertEquals(studentClass, student.getStudentClass());
  }

  @Test
  void testToStringIncludesFields() {
    StudentClass studentClass = new StudentClass();
    Student student = new Student(1, "Anna", "Nowak", studentClass);
    String str = student.toString();

    assertTrue(str.contains("id=1"));
    assertTrue(str.contains("name='Anna'"));
    assertTrue(str.contains("lastname='Nowak'"));
    assertTrue(str.contains("class_id="));
  }
}
