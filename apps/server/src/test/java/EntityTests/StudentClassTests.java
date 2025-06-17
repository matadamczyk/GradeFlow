package EntityTests;

import com.example.demo.entity.StudentClass;
import com.example.demo.entity.Teacher;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class StudentClassTests {

  @Test
  void testSetAndGetId() {
    StudentClass studentClass = new StudentClass();
    studentClass.setId(1);
    assertEquals(1, studentClass.getId());
  }

  @Test
  void testSetAndGetLetter() {
    StudentClass studentClass = new StudentClass();
    studentClass.setLetter('A');
    assertEquals('A', studentClass.getLetter());
  }

  @Test
  void testSetAndGetNumber() {
    StudentClass studentClass = new StudentClass();
    studentClass.setNumber((byte) 3);
    assertEquals((byte) 3, studentClass.getNumber());
  }

  @Test
  void testSetAndGetTutor() {
    StudentClass studentClass = new StudentClass();
    Teacher teacher = new Teacher();
    teacher.setId(10);
    teacher.setName("Anna");
    teacher.setLastname("Nowak");

    studentClass.setTutor(teacher);
    assertEquals(teacher, studentClass.getTutor());
  }

  @Test
  void testGetClassName() {
    StudentClass studentClass = new StudentClass();
    studentClass.setLetter('B');
    studentClass.setNumber((byte) 2);

    assertEquals("2B", studentClass.getClassName());
  }

  @Test
  void testSetClassName() {
    StudentClass studentClass = new StudentClass();
    studentClass.setClassName('C', (byte) 4);

    assertEquals('C', studentClass.getLetter());
    assertEquals((byte) 4, studentClass.getNumber());
    assertEquals("4C", studentClass.getClassName());
  }
}
