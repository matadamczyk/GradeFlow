package com.example.demo.rest;


import com.example.demo.dao.*;
import com.example.demo.dto.TimetableRequest;
import com.example.demo.entity.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.util.ReflectionTestUtils;


import java.util.List;
import java.util.Optional;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.any;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
@ActiveProfiles("test")
public class TimeTableControllerTest {

  private User testUser = new User(1,"mail@gmail.com","pass", Role.ADMIN);
  private TimetableController timetableController;

  Integer lesson_id = lesson_id = 11;
  StudentClass studentClass = mock(StudentClass.class) ;
  TeacherSubject teacherSubject = mock(TeacherSubject.class);
  Integer lesson_number = lesson_number =13;
  WorkDay day = WorkDay.WED;

  private Timetable testTimetable = new Timetable();

  @Mock
  private TimetableRepository timetableRepository;
  @Mock
  private StudentClassRepository classRepository;
  @Mock
  private TeacherSubjectRepository teacherSubjectRepository;
  @Mock
  private StudentRepository studentRepository;

  @BeforeEach
  public void setUp() {
    testUser.setEmail("mail@gmail.com");
    testUser.setPassword("pass");
    testUser.setId(1);
    testUser.setRole(Role.ADMIN);

    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(testUser, "password");
    SecurityContextHolder.getContext().setAuthentication(authenticationToken);


    timetableController = new TimetableController(timetableRepository, classRepository, teacherSubjectRepository, studentRepository);

    ReflectionTestUtils.setField(timetableController, "timetableRepository", timetableRepository);
    ReflectionTestUtils.setField(timetableController, "classRepository", classRepository);
    ReflectionTestUtils.setField(timetableController, "teacherSubjectRepository", teacherSubjectRepository);
    ReflectionTestUtils.setField(timetableController, "studentRepository", studentRepository);

    testTimetable = new Timetable(lesson_id, studentClass, teacherSubject, lesson_number, day);
  }

  @Test
  public void testGetAllTimetables() {
    when(timetableRepository.findAll()).thenReturn(List.of(testTimetable));
    assertEquals(200, timetableController.getAllTimetables().getStatusCodeValue());
    assertEquals(List.of(testTimetable), timetableController.getAllTimetables().getBody());
  }

  @Test
  public void testGetAllTimetablesNotFound() {
    when(timetableRepository.findAll()).thenReturn(List.of());
    assertEquals(200, timetableController.getAllTimetables().getStatusCodeValue());
    assertEquals(List.of(), timetableController.getAllTimetables().getBody());
  }

  @Test
  public void testGetTimetableForStudentClass () {
    Integer classId = 5;
    Student student = mock(Student.class);

    when(classRepository.findById(classId)).thenReturn(Optional.of(studentClass));
    when(timetableRepository.findByStudentClass(studentClass)).thenReturn(List.of(testTimetable));

    ResponseEntity<List<Timetable>> response = timetableController.getTimetableForStudentClass(classId);

    assertEquals(200, response.getStatusCodeValue());
    assertEquals(List.of(testTimetable), response.getBody());
  }

  @Test
  public void testGetTimetableForStudentClassStudentCorrectCall () {
    testUser.setRole(Role.STUDENT);
    Integer classId = 5;
    Student student = mock(Student.class);

    when(studentRepository.findByUserId(testUser.getId())).thenReturn(Optional.of(student));

    when(student.getStudentClass()).thenReturn(studentClass);
    when(studentClass.getId()).thenReturn(classId);

    when(classRepository.findById(classId)).thenReturn(Optional.of(studentClass));
    when(timetableRepository.findByStudentClass(studentClass)).thenReturn(List.of(testTimetable));

    ResponseEntity<List<Timetable>> response = timetableController.getTimetableForStudentClass(classId);

    assertEquals(200, response.getStatusCodeValue());
    assertEquals(List.of(testTimetable), response.getBody());
  }

  @Test
  public void testGetTimetableForStudentClassStudentIncorrectCall () {
    testUser.setRole(Role.STUDENT);
    Integer classId = 5;
    Student student = mock(Student.class);

    when(studentRepository.findByUserId(testUser.getId())).thenReturn(Optional.of(student));

    when(student.getStudentClass()).thenReturn(studentClass);
    when(studentClass.getId()).thenReturn(classId+1);

    ResponseEntity<List<Timetable>> response = timetableController.getTimetableForStudentClass(classId);

    assertEquals(403, response.getStatusCodeValue());
    assertEquals(ResponseEntity.status(HttpStatus.FORBIDDEN).build(), response);
  }

  @Test
  public void testGetTimetableByTeacher () {
    Integer teacherId=15;

    when(timetableRepository.findByTeacherId(teacherId)).thenReturn(List.of(testTimetable));

    ResponseEntity<List<Timetable>> response = timetableController.getTimetableByTeacher(teacherId);

    assertEquals(200, response.getStatusCodeValue());
    assertEquals(List.of(testTimetable), response.getBody());
  }

  @Test
  public void testCreateTimetable () {
    TimetableRequest timetableRequest = mock(TimetableRequest.class);
    Integer teacherId = 14;

    when(timetableRequest.getClassId()).thenReturn(lesson_id);
    when(classRepository.findById(lesson_id)).thenReturn(Optional.of(studentClass));

    when(timetableRepository.save(any(Timetable.class))).thenReturn(testTimetable);

    when(timetableRequest.getTeacherSubjectId()).thenReturn(teacherId);
    when(teacherSubjectRepository.findById(teacherId)).thenReturn(Optional.of(teacherSubject));

    ResponseEntity<?> response = timetableController.createTimetable(timetableRequest);

    assertEquals(200, response.getStatusCodeValue());
    assertEquals(testTimetable, response.getBody());
  }

  @Test
  public void testdeleteTimetable () {
    when(timetableRepository.findById(lesson_id)).thenReturn(Optional.of(testTimetable));

    ResponseEntity<?> response = timetableController.deleteTimetable(lesson_id);
    assertEquals(200, response.getStatusCodeValue());
    verify(timetableRepository).delete(testTimetable);
  }

  @Test
  public void testUpdateTimetable () {
    TimetableRequest timetableRequest = mock(TimetableRequest.class);
    TeacherSubject newTeacherSubject = mock(TeacherSubject.class);
    StudentClass newStudentClass = mock(StudentClass.class);
    Integer classID=10;
    Integer newLessonNumber=5;

    when(timetableRepository.findById(lesson_id)).thenReturn(Optional.of(testTimetable));

    when(timetableRequest.getTeacherSubjectId()).thenReturn(lesson_id);
    when(teacherSubjectRepository.findById(lesson_id)).thenReturn(Optional.of(newTeacherSubject));

    when(timetableRequest.getClassId()).thenReturn(classID);
    when(classRepository.findById(classID)).thenReturn(Optional.of(newStudentClass));

    when(timetableRequest.getLessonNumber()).thenReturn(newLessonNumber);
    when(timetableRequest.getDay()).thenReturn(WorkDay.THU);

    ResponseEntity<?> response = timetableController.updateTimetable(lesson_id, timetableRequest);
    Timetable output = (Timetable) response.getBody();

    assertEquals(200, response.getStatusCodeValue());
    assertEquals(newTeacherSubject, output.getTeacherSubject());
    assertEquals(newStudentClass, output.getStudentClass());
    assertEquals(newLessonNumber, output.getLesson_number());
    assertEquals(WorkDay.THU, output.getDay());
    verify(timetableRepository).save(testTimetable);

  }


}
