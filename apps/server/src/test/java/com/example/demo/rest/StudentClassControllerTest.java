package com.example.demo.rest;

import com.example.demo.dao.StudentClassRepository;
import com.example.demo.dao.StudentRepository;
import com.example.demo.dao.TeacherRepository;
import com.example.demo.dto.StudentClassRequest;
import com.example.demo.dto.StudentRequest;
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
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.mock;


@ExtendWith(MockitoExtension.class)
@SpringBootTest
@ActiveProfiles("test")
public class StudentClassControllerTest {

  private User testUser = new User(1,"mail@gmail.com","pass", Role.ADMIN);
  private StudentClassController studentClassController;

  @Mock
  private StudentClassRepository studentClassRepository;
  @Mock
  private TeacherRepository teacherRepository;
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


    studentClassController = new StudentClassController();

    ReflectionTestUtils.setField(studentClassController, "studentClassRepository", studentClassRepository);
    ReflectionTestUtils.setField(studentClassController, "teacherRepository", teacherRepository);
    ReflectionTestUtils.setField(studentClassController, "studentRepository", studentRepository);
  }

  @Test
  public void testCreateClass () {
    Integer tutorId = 5;
    Teacher teacher = mock(Teacher.class);
    StudentClassRequest request = new StudentClassRequest();
    request.setLetter('A');
    request.setNumber((byte)3);
    request.setTutorId(tutorId);

    when(teacherRepository.findById(tutorId)).thenReturn(Optional.of(teacher));
    when(studentClassRepository.save(any(StudentClass.class))).thenAnswer(invocation -> invocation.getArgument(0));

    ResponseEntity<?> response = studentClassController.createClass(request);
    StudentClass studentClass = (StudentClass) response.getBody();

    assertEquals(200, response.getStatusCodeValue());
    assertEquals('A', studentClass.getLetter());
    assertEquals((byte)3, studentClass.getNumber());
    assertEquals(teacher, studentClass.getTutor());
    verify(studentClassRepository).save(any(StudentClass.class));
  }

  @Test
  public void testGetAllClasses() {
    StudentClass studentClass = mock(StudentClass.class);
    StudentClass studentClass2 = mock(StudentClass.class);

    List<StudentClass> studentClasses = Arrays.asList(studentClass, studentClass2);

    when(studentClassRepository.findAll()).thenReturn(studentClasses);
    ResponseEntity<?> response = studentClassController.getAllClasses();
    assertEquals(200, response.getStatusCodeValue());
    assertEquals(studentClasses, response.getBody());

  }

  @Test
  public void testGetStudentClass () {
    Integer classId = 15;
    StudentClass studentClass = mock(StudentClass.class);

    when(studentClassRepository.findById(classId)).thenReturn(Optional.of(studentClass));
    ResponseEntity<?> response = studentClassController.getStudentClass(classId);
    assertEquals(200, response.getStatusCodeValue());
    assertEquals(studentClass, response.getBody());
  }
  @Test
  public void testDeleteClass () {
    Integer classId = 15;
    StudentClass studentClass = mock(StudentClass.class);

    when(studentClassRepository.findById(classId)).thenReturn(Optional.of(studentClass));
    when(studentRepository.findByStudentClass(studentClass)).thenReturn(Collections.emptyList());
    ResponseEntity<?> response = studentClassController.deleteClass(classId);
    assertEquals(200, response.getStatusCodeValue());
    assertEquals(studentClass, response.getBody());
    verify(studentClassRepository).delete(any(StudentClass.class));
  }

  @Test
  public void testDeleteClassNotEmpty () {
    Integer classId = 15;
    Student student = mock(Student.class);
    StudentClass studentClass = mock(StudentClass.class);

    when(studentClassRepository.findById(classId)).thenReturn(Optional.of(studentClass));
    when(studentRepository.findByStudentClass(studentClass)).thenReturn(List.of(student));
    ResponseEntity<?> response = studentClassController.deleteClass(classId);
    ResponseEntity<?> predictedResponse = ResponseEntity.badRequest().body("Cannot delete class with assigned students.");
    assertEquals(predictedResponse, response);
  }

  @Test
  public void testUpdateClass () {
    Integer classId = 15;
    Teacher teacher = mock(Teacher.class);
    StudentClass studentClass = new StudentClass();
    StudentClassRequest request = new StudentClassRequest();
    request.setLetter('A');
    request.setNumber((byte)3);


    when(studentClassRepository.findById(classId)).thenReturn(Optional.of(studentClass));
    when(teacherRepository.findById(request.getTutorId())).thenReturn(Optional.of(teacher));

    ResponseEntity<?> response = studentClassController.updateClass(classId, request);
    StudentClass studentClassUpdated = (StudentClass) response.getBody();

    assertEquals(200, response.getStatusCodeValue());
    assertEquals(studentClass, response.getBody());
    assertEquals(request.getLetter(), studentClassUpdated.getLetter());
    assertEquals(request.getNumber(), studentClassUpdated.getNumber());
    assertEquals(teacher, studentClassUpdated.getTutor());
    verify(studentClassRepository).save(any(StudentClass.class));
  }
}
