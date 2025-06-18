package com.example.demo.rest;

import com.example.demo.dao.*;
import com.example.demo.dto.StudentRequest;
import com.example.demo.dto.TeacherSubjectRequest;
import com.example.demo.entity.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
@ActiveProfiles("test")
public class StudentControllerTest {

  private User testUser = new User(1,"mail@gmail.com","pass", Role.ADMIN);
  private StudentController studentController;

  @Mock
  private StudentRepository studentRepository;
  @Mock
  private StudentClassRepository studentClassRepository;

  private StudentRequest studentRequest = mock(StudentRequest.class);


  @BeforeEach
  public void setUp() {
    testUser.setEmail("mail@gmail.com");
    testUser.setPassword("pass");
    testUser.setId(1);
    testUser.setRole(Role.ADMIN);

    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(testUser, "password");
    SecurityContextHolder.getContext().setAuthentication(authenticationToken);


    studentController = new StudentController();

    ReflectionTestUtils.setField(studentController, "studentRepository", studentRepository);
    ReflectionTestUtils.setField(studentController, "studentClassRepository", studentClassRepository);
  }

  @Test
  public void testCreateStudent () {
    Integer classId = 5;
    Integer userId = 15;
    StudentClass studentClass = mock(StudentClass.class);
    String name = "testName";
    String lastName = "testLastName";
    Student student = mock(Student.class);

    when(studentRequest.getClassId()).thenReturn(classId);
    when(studentClassRepository.findById(classId)).thenReturn(Optional.of(studentClass));
    when(studentRequest.getName()).thenReturn(name);
    when(studentRequest.getLastname()).thenReturn(lastName);
    when(studentRequest.getUserId()).thenReturn(userId);
    when(studentRepository.save(any(Student.class))).thenReturn(student);

    ResponseEntity<?> response = studentController.createStudent(studentRequest);

    assertEquals(200, response.getStatusCodeValue());
    assertEquals(student, response.getBody());
    verify(studentRepository).save(any(Student.class));
  }

  @Test
  public void testGetAllStudents () {
    Student student1 = mock(Student.class);
    when(studentRepository.findAll()).thenReturn(List.of(student1));

    ResponseEntity<?> response = studentController.getAllStudents();

    assertEquals(200, response.getStatusCodeValue());
    assertEquals(List.of(student1), response.getBody());
  }

  @Test
  public void testGetStudentsFromStudentClass () {
    Integer studentClassId = 5;
    Student student1 = mock(Student.class);
    StudentClass studentClass = mock(StudentClass.class);

    when(studentClassRepository.findById(studentClassId)).thenReturn(Optional.of(studentClass));
    when(studentRepository.findByStudentClass(studentClass)).thenReturn(List.of(student1));

    ResponseEntity<?> response = studentController.getStudentsFromStudentClass(studentClassId);

    assertEquals(200, response.getStatusCodeValue());
    assertEquals(List.of(student1), response.getBody());
  }

  @Test
  public void testGetStudentByUserId () {
    Integer userId = 15;
    Student student1 = mock(Student.class);
    when(studentRepository.findByUserId(userId)).thenReturn(Optional.of(student1));

    ResponseEntity<?> response = studentController.getStudentByUserId(userId);
    assertEquals(200, response.getStatusCodeValue());
    assertEquals(student1, response.getBody());
  }

  @Test
  public void testGetStudentByUserIdSelfCheck () {
    testUser.setRole(Role.STUDENT);
    Integer userId = 1;
    Student student1 = mock(Student.class);
    when(studentRepository.findByUserId(userId)).thenReturn(Optional.of(student1));

    ResponseEntity<?> response = studentController.getStudentByUserId(userId);
    assertEquals(200, response.getStatusCodeValue());
    assertEquals(student1, response.getBody());
  }

  @Test
  public void testGetStudentByUserIdStudent () {
    testUser.setRole(Role.STUDENT);
    Integer userId = 15;

    ResponseEntity<?> response = studentController.getStudentByUserId(userId);
    assertEquals(ResponseEntity.status(HttpStatus.FORBIDDEN).build(), response);
  }

  @Test
  public void testDeleteStudent () {
    Integer studentId = 5;
    Student student1 = mock(Student.class);

    when(studentRepository.findById(studentId)).thenReturn(Optional.of(student1));
    ResponseEntity<?> response = studentController.deleteStudent(studentId);
    assertEquals(200, response.getStatusCodeValue());
    assertEquals(student1, response.getBody());
    verify(studentRepository).delete(student1);
  }

  @Test
  public void testUpdateStudent () {
    Integer studentId = 5;
    Integer newId = 11;
    Integer classId = 7;
    Student student1 = new Student();
    student1.setId(studentId);

    StudentClass studentClass = mock(StudentClass.class);

    StudentRequest request = new StudentRequest();
    request.setClassId(classId);
    request.setUserId(newId);
    request.setName("testName");
    request.setLastname("testLastName");


    when(studentRepository.findById(studentId)).thenReturn(Optional.of(student1));
    when(studentRequest.getClassId()).thenReturn(classId);
    when(studentClassRepository.findById(classId)).thenReturn(Optional.of(studentClass));
    when(studentRepository.save(any(Student.class))).thenReturn(student1);

    ResponseEntity<?> response = studentController.updateStudent(studentId, request);
    assertEquals(200, response.getStatusCodeValue());
    assertEquals(student1, response.getBody());
    assertEquals(newId, student1.getUserId());
    assertEquals("testName", student1.getName());
    assertEquals("testLastName", student1.getLastname());
    assertEquals(studentId, student1.getId());
  }

}
