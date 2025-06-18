package com.example.demo.rest;
import com.example.demo.dao.*;
import com.example.demo.dto.TeacherSubjectRequest;
import com.example.demo.entity.*;
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
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
@ActiveProfiles("test")
public class TeacherSubjectControllerTest {

  private User testUser = new User(1,"mail@gmail.com","pass", Role.ADMIN);
  private TeacherSubjectController teacherSubjectController;

  @Mock
  private TeacherRepository teacherRepository;
  @Mock
  private SubjectRepository subjectRepository;
  @Mock
  private TeacherSubjectRepository teacherSubjectRepository;

  private TeacherSubjectRequest teacherSubjectRequest = mock(TeacherSubjectRequest.class);
  private Subject subject = mock(Subject.class);
  private Teacher teacher = mock(Teacher.class);


  @BeforeEach
  public void setUp() {
    testUser.setEmail("mail@gmail.com");
    testUser.setPassword("pass");
    testUser.setId(1);
    testUser.setRole(Role.ADMIN);

    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(testUser, "password");
    SecurityContextHolder.getContext().setAuthentication(authenticationToken);


    teacherSubjectController = new TeacherSubjectController(teacherRepository,subjectRepository,teacherSubjectRepository);

    ReflectionTestUtils.setField(teacherSubjectController, "teacherRepository", teacherRepository);
    ReflectionTestUtils.setField(teacherSubjectController, "subjectRepository", subjectRepository);
    ReflectionTestUtils.setField(teacherSubjectController, "teacherSubjectRepository", teacherSubjectRepository);
  }

  @Test
  public void testAssignSubjectToTeacher () {
    Integer teacherId= 4;
    Integer subjectId = 18;
    when(teacherSubjectRequest.getTeacher_id()).thenReturn(teacherId);
    when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(teacher));

    when(teacherSubjectRequest.getSubject_id()).thenReturn(subjectId);
    when(subjectRepository.findById(subjectId)).thenReturn(Optional.of(subject));

    ResponseEntity<?> response = teacherSubjectController.assignSubjectToTeacher(teacherSubjectRequest);

    assertEquals(200, response.getStatusCodeValue());
    verify(teacherSubjectRepository).save(any(TeacherSubject.class));
  }

  @Test
  public void testAssignSubjectToTeacherEmpty () {
    Integer teacherId= 4;
    Integer subjectId = 18;
    when(teacherSubjectRequest.getTeacher_id()).thenReturn(teacherId);
    when(teacherRepository.findById(teacherId)).thenReturn(Optional.empty());

    when(teacherSubjectRequest.getSubject_id()).thenReturn(subjectId);
    when(subjectRepository.findById(subjectId)).thenReturn(Optional.empty());

    ResponseEntity<?> response = teacherSubjectController.assignSubjectToTeacher(teacherSubjectRequest);

    assertEquals(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Teacher or Subject not found"), response);
  }

  @Test
  public void testAssignSubjectToTeacherOneEmpty () {
    Integer teacherId= 4;
    Integer subjectId = 18;
    when(teacherSubjectRequest.getTeacher_id()).thenReturn(teacherId);
    when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(teacher));

    when(teacherSubjectRequest.getSubject_id()).thenReturn(subjectId);
    when(subjectRepository.findById(subjectId)).thenReturn(Optional.empty());

    ResponseEntity<?> response = teacherSubjectController.assignSubjectToTeacher(teacherSubjectRequest);

    assertEquals(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Teacher or Subject not found"), response);
  }

  @Test
  public void testGetAllAssignments () {
    TeacherSubject teacherSubject1 = mock(TeacherSubject.class);
    TeacherSubject teacherSubject2 = mock(TeacherSubject.class);
    TeacherSubject teacherSubject3 = mock(TeacherSubject.class);

    List<TeacherSubject> teacherSubjectList = Arrays.asList(teacherSubject1, teacherSubject2, teacherSubject3);
    when(teacherSubjectRepository.findAll()).thenReturn(teacherSubjectList);

    ResponseEntity<?> response = teacherSubjectController.getAllAssignments();
    assertEquals(200, response.getStatusCodeValue());
    assertEquals(teacherSubjectList, response.getBody());
  }
}
