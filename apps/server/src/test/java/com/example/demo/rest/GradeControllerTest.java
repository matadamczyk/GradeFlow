package com.example.demo.rest;

import com.example.demo.dao.GradeRepository;
import com.example.demo.dao.StudentRepository;
import com.example.demo.dao.TeacherSubjectRepository;
import com.example.demo.dao.TimetableRepository;
import com.example.demo.dto.GradeRequest;
import com.example.demo.entity.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
@ActiveProfiles("test")
public class GradeControllerTest {


  @Mock
  private GradeRepository gradeRepository;

  @Mock
  private StudentRepository studentRepository;

  @Mock
  private TeacherSubjectRepository teacherSubjectRepository;

  @Mock
  private TimetableRepository timetableRepository;
  GradeController controller;

  private User testUser;
  //  private final GradeRequest gradeRequest = new GradeRequest();
//
//


  @BeforeEach
  public void setUp() {
    testUser = new User();
    testUser.setId(1);
    testUser.setRole(Role.ADMIN);

    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(testUser, "password");
    SecurityContextHolder.getContext().setAuthentication(authenticationToken);


    controller = new GradeController();

    ReflectionTestUtils.setField(controller, "gradeRepository", gradeRepository);
    ReflectionTestUtils.setField(controller, "studentRepository", studentRepository);
    ReflectionTestUtils.setField(controller, "teacherSubjectRepository", teacherSubjectRepository);
    ReflectionTestUtils.setField(controller, "timetableRepository", timetableRepository);
  }

  @Test
  @WithUserDetails
  public void TestGetGradesFromTeacherSubjectCorrectValues() {
    int studentId=4;
    int subjectId=2;
    int gradeId=10;

    Student student = new Student(1,"name1", "lastname1", new StudentClass());
    Teacher teacher = mock(Teacher.class);
    Subject subject = mock(Subject.class);
    TeacherSubject teacherSubject = new TeacherSubject(subjectId, teacher, subject);

    Timetable timetable = new Timetable();
    timetable.setLesson_id(5);

    Grade grade = new Grade(gradeId, student,teacherSubject,timetable, Date.valueOf("2007-12-03"), 4.0f, 1, "ok?");

    when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
    when(teacherSubjectRepository.findById(subjectId)).thenReturn(Optional.of(teacherSubject));
    when(gradeRepository.findByStudentAndTeacherSubject(student,teacherSubject)).thenReturn(List.of(grade));

    ResponseEntity<List<Grade>> response = controller.getGradesFromTeacherSubject(studentId,subjectId);

    assertAll(
      ()->assertEquals(200,response.getStatusCodeValue()),
      ()->assertEquals(1,response.getBody().size()),
      ()->assertEquals(grade,response.getBody().getFirst())
    );
  }

  @WithUserDetails
  @Test
  public void TestGetGradesFromTeacherSubjectIncorrectStudentId() {
    int studentId=4;
    int subjectId=2;
    int gradeId=10;

    Student student = new Student(studentId,"name1", "lastname1", new StudentClass());
    Teacher teacher = mock(Teacher.class);
    Subject subject = mock(Subject.class);
    TeacherSubject teacherSubject = new TeacherSubject(subjectId, teacher, subject);

    Timetable timetable = new Timetable();
    timetable.setLesson_id(5);

    Grade grade = new Grade(gradeId, student,teacherSubject,timetable, Date.valueOf("2007-12-03"), 4.0f, 1, "ok?");

    assertThrows(IllegalArgumentException.class,
      ()->{controller.getGradesFromTeacherSubject(0,subjectId);});
  }

  @WithUserDetails
  @Test
  public void getAllGrades(){
    assertEquals(ResponseEntity.ok(gradeRepository.findAll()),controller.getAllGrades());
  }

  @Test
  public void getGrades() {
    int studentId=4;
    int subjectId=2;
    int gradeId=10;

    Student student = new Student(studentId,"name1", "lastname1", new StudentClass());
    Teacher teacher = mock(Teacher.class);
    Subject subject = mock(Subject.class);
    TeacherSubject teacherSubject = new TeacherSubject(subjectId, teacher, subject);

    Timetable timetable = new Timetable();
    timetable.setLesson_id(5);

    Grade grade = new Grade(gradeId, student,teacherSubject,timetable, Date.valueOf("2007-12-03"), 4.0f, 1, "ok?");

    when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));

    List<Grade> grades = gradeRepository.findByStudent(student);

    assertEquals(ResponseEntity.ok(grades),controller.getGrades(studentId));
  }

}
