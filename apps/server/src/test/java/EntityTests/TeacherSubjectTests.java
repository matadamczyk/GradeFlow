package EntityTests;

import com.example.demo.entity.Subject;
import com.example.demo.entity.Teacher;
import com.example.demo.entity.TeacherSubject;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class TeacherSubjectTests {

  @Test
  void shouldSetAndGetId() {
    TeacherSubject ts = new TeacherSubject();
    ts.setId(10);
    assertEquals(10, ts.getId());
  }

  @Test
  void shouldSetAndGetTeacher() {
    TeacherSubject ts = new TeacherSubject();
    Teacher teacher = new Teacher();
    ts.setTeacher(teacher);
    assertEquals(teacher, ts.getTeacher());
  }

  @Test
  void shouldSetAndGetSubject() {
    TeacherSubject ts = new TeacherSubject();
    Subject subject = new Subject();
    ts.setSubject(subject);
    assertEquals(subject, ts.getSubject());
  }

  @Test
  void constructorShouldInitializeFields() {
    Teacher teacher = new Teacher();
    Subject subject = new Subject();
    TeacherSubject ts = new TeacherSubject(1, teacher, subject);

    assertEquals(1, ts.getId());
    assertEquals(teacher, ts.getTeacher());
    assertEquals(subject, ts.getSubject());
  }
}
