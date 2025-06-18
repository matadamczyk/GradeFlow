package com.example.demo.rest;
import com.example.demo.dao.*;
import com.example.demo.dto.TeacherRequest;
import com.example.demo.dto.TeacherSubjectRequest;
import com.example.demo.entity.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
@ActiveProfiles("test")
public class TeacherControllerTest {

  private User testUser = new User(1,"mail@gmail.com","pass", Role.ADMIN);
  private TeacherController teacherController;

  @Mock
  private TeacherRepository teacherRepository;
  @Mock
  private StudentClassRepository studentClassRepository;
  @Mock
  private TeacherSubjectRepository teacherSubjectRepository;
  @Mock
  private TimetableRepository timetableRepository;

  private TeacherRequest teacherRequest = mock(TeacherRequest.class);

  @BeforeEach
  public void setUp() {
    testUser.setEmail("mail@gmail.com");
    testUser.setPassword("pass");
    testUser.setId(1);
    testUser.setRole(Role.ADMIN);

    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(testUser, "password");
    SecurityContextHolder.getContext().setAuthentication(authenticationToken);


    teacherController = new TeacherController();

    ReflectionTestUtils.setField(teacherController, "teacherRepository", teacherRepository);
    ReflectionTestUtils.setField(teacherController, "studentClassRepository", studentClassRepository);
    ReflectionTestUtils.setField(teacherController, "teacherSubjectRepository", teacherSubjectRepository);
    ReflectionTestUtils.setField(teacherController, "timetableRepository", timetableRepository);
  }

  @Test
  public void testCreateTeacher () {
    String name= "name1";
    String lastName= "lastname1";
    Teacher savedTeacher = mock(Teacher.class);

    when(teacherRequest.getName()).thenReturn(name);
    when(teacherRequest.getLastname()).thenReturn(lastName);
    when(teacherRepository.save(any(Teacher.class))).thenReturn(savedTeacher);

    ResponseEntity<?> response = teacherController.createTeacher(teacherRequest);
    Teacher teacher = (Teacher) response.getBody();



    assertEquals(200,response.getStatusCodeValue());
    assertEquals(savedTeacher,response.getBody());
  }

  @Test
  public void testGetAllTeachers () {
    Teacher teacher1 = mock(Teacher.class);
    Teacher teacher2 = mock(Teacher.class);
    Teacher teacher3 = mock(Teacher.class);

    List<Teacher> teachers = Arrays.asList(teacher1, teacher2, teacher3);
    when(teacherRepository.findAll()).thenReturn(teachers);
    ResponseEntity<?> response = teacherController.getAllTeachers();

    assertEquals(200,response.getStatusCodeValue());
    assertEquals(teachers,response.getBody());
  }

  @Test
  public void testGetTeachersByStudentClassFromTimetable () {
    Integer studentClassId = 11;
    Teacher teacher1 = mock(Teacher.class);
    Teacher teacher2 = mock(Teacher.class);
    Teacher teacher3 = mock(Teacher.class);

    List<Teacher> teachers = Arrays.asList(teacher1, teacher2, teacher3);

    when(teacherRepository.findTeachersByClassId(studentClassId)).thenReturn(teachers);

    ResponseEntity<?> response = teacherController.getTeachersByStudentClassFromTimetable(studentClassId);

    assertEquals(200,response.getStatusCodeValue());
    assertEquals(teachers,response.getBody());
  }

  @Test
  public void testGetTeacherClasses () {
    Integer teacherId=15;
    Teacher teacher1 = mock(Teacher.class);
    Timetable timetable1 = mock(Timetable.class);
    StudentClass studentClass1 = mock(StudentClass.class);

    when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(teacher1));
    when(timetableRepository.findByTeacherSubjectTeacher(teacher1)).thenReturn(List.of(timetable1));
    when(timetable1.getStudentClass()).thenReturn(studentClass1);

    ResponseEntity<?> response = teacherController.getTeacherClasses(teacherId);

    assertEquals(200,response.getStatusCodeValue());
    assertEquals(List.of(studentClass1),response.getBody());
  }

  @Test
  public void  testGetTeacherSubjects() {
    Integer teacherId=13;
    Teacher teacher1 = mock(Teacher.class);
    TeacherSubject teacherSubject1 = mock(TeacherSubject.class);

    when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(teacher1));
    when(teacherSubjectRepository.findByTeacher(teacher1)).thenReturn(List.of(teacherSubject1));

    ResponseEntity<?> response = teacherController.getTeacherSubjects(teacherId);
    assertEquals(200,response.getStatusCodeValue());
    assertEquals(List.of(teacherSubject1),response.getBody());
  }

  @Test
  public void testDeleteTeacher () {
    Integer teacherId=11;
    Teacher teacher1 = mock(Teacher.class);


    when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(teacher1));
    when(studentClassRepository.findByTutor(teacher1)).thenReturn(null);

    ResponseEntity<?> response = teacherController.deleteTeacher(teacherId);
    assertEquals(200,response.getStatusCodeValue());
    assertEquals(teacher1,response.getBody());
    verify(teacherRepository).delete(teacher1);
    verify(teacherSubjectRepository).deleteByTeacherId(teacherId);
  }


  @Test
  public void testDeleteTeacherNotNull () {
    Integer teacherId=11;
    Teacher teacher1 = mock(Teacher.class);
    StudentClass studentClass1 = mock(StudentClass.class);

    when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(teacher1));
    when(studentClassRepository.findByTutor(teacher1)).thenReturn(studentClass1);

    ResponseEntity<?> response = teacherController.deleteTeacher(teacherId);
    ResponseEntity<?> probableResponse = ResponseEntity.badRequest().body("Cannot delete teacher with assigned class.");
    assertEquals(probableResponse,response);
  }

  @Test
  public void testUpdateTeacher () {
    Integer teacherId=11;
    Teacher teacher1 = new Teacher();
    when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(teacher1));
    when(teacherRequest.getName()).thenReturn("name1");
    when(teacherRequest.getLastname()).thenReturn("lastname1");

    ResponseEntity<?> response = teacherController.updateTeacher(teacherId, teacherRequest);

    assertEquals(200,response.getStatusCodeValue());
    assertEquals(teacher1,response.getBody());
    assertEquals("name1",teacherRequest.getName());
    assertEquals("lastname1",teacherRequest.getLastname());
    verify(teacherRepository).save(teacher1);
  }
}
