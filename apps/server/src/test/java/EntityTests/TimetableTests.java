package EntityTests;

import com.example.demo.entity.*;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class TimetableTests {

  @Test
  void testSetAndGetLessonId() {
    Timetable timetable = new Timetable();
    timetable.setLesson_id(1);
    assertEquals(1, timetable.getLesson_id());
  }

  @Test
  void testSetAndGetLessonNumber() {
    Timetable timetable = new Timetable();
    timetable.setLesson_number(4);
    assertEquals(4, timetable.getLesson_number());
  }

  @Test
  void testSetAndGetDay() {
    Timetable timetable = new Timetable();
    timetable.setDay(WorkDay.MON);
    assertEquals(WorkDay.MON, timetable.getDay());
  }

  @Test
  void testSetAndGetStudentClass() {
    Timetable timetable = new Timetable();
    StudentClass studentClass = new StudentClass();
    timetable.setStudentClass(studentClass);
    assertEquals(studentClass, timetable.getStudentClass());
  }

  @Test
  void testSetAndGetTeacherSubject() {
    Timetable timetable = new Timetable();
    TeacherSubject teacherSubject = new TeacherSubject();
    timetable.setTeacherSubject(teacherSubject);
    assertEquals(teacherSubject, timetable.getTeacherSubject());
  }

  @Test
  void testConstructorSetsAllFields() {
    StudentClass studentClass = new StudentClass();
    TeacherSubject teacherSubject = new TeacherSubject();
    Timetable timetable = new Timetable(10, studentClass, teacherSubject, 3, WorkDay.WED);

    assertEquals(10, timetable.getLesson_id());
    assertEquals(studentClass, timetable.getStudentClass());
    assertEquals(teacherSubject, timetable.getTeacherSubject());
    assertEquals(3, timetable.getLesson_number());
    assertEquals(WorkDay.WED, timetable.getDay());
  }
}
