package com.example.demo.rest;
import com.example.demo.dao.*;
import com.example.demo.dto.PresenceRequest;
import com.example.demo.dto.ScheduleRequest;
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

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
@ActiveProfiles("test")
public class PresenceControllerTest {
  private User testUser = new User(1,"mail@gmail.com","pass", Role.ADMIN);
  private PresenceController presenceController;

  @Mock
  private PresenceRepository presenceRepository;
  @Mock
  private StudentRepository studentRepository;
  @Mock
  private TimetableRepository timetableRepository;


  @BeforeEach
  public void setUp() {
    testUser.setEmail("mail@gmail.com");
    testUser.setPassword("pass");
    testUser.setId(1);
    testUser.setRole(Role.ADMIN);


    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(testUser, "password");
    SecurityContextHolder.getContext().setAuthentication(authenticationToken);


    presenceController = new PresenceController();

    ReflectionTestUtils.setField(presenceController, "timetableRepository", timetableRepository);
    ReflectionTestUtils.setField(presenceController, "presenceRepository", presenceRepository);
    ReflectionTestUtils.setField(presenceController, "studentRepository", studentRepository);
  }

  @Test
  public void tsetCreatePresence () {
    Integer studentId = 13;
    Integer timetableId = 15;
    Student student = mock(Student.class);
    Timetable timetable = mock(Timetable.class);
    PresenceRequest request = new PresenceRequest();
    request.setStudentId(studentId);
    request.setDate(Date.valueOf("2022-04-05"));
    request.setLessonId(timetableId);

    when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
    when(timetableRepository.findById(timetableId)).thenReturn(Optional.of(timetable));
    when(student.getId()).thenReturn(studentId);
    when(timetable.getLesson_id()).thenReturn(timetableId);

    ResponseEntity<?> response = presenceController.createPresence(request);
    Presence presence = (Presence) response.getBody();

    assertEquals(200, response.getStatusCodeValue());
    assertEquals(request.getDate(), presence.getDate());
    assertEquals(request.getStudentId(), presence.getStudent().getId());
    assertEquals(request.getLessonId(),presence.getLesson().getLesson_id());
    verify(presenceRepository).save(any(Presence.class));

  }

  @Test
  public void tsetCreatePresenceEmptyDate () {
    Integer studentId = 13;
    Integer timetableId = 15;
    Student student = mock(Student.class);
    Timetable timetable = mock(Timetable.class);
    PresenceRequest request = new PresenceRequest();
    request.setStudentId(studentId);
    request.setLessonId(timetableId);

    when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
    when(timetableRepository.findById(timetableId)).thenReturn(Optional.of(timetable));
    when(student.getId()).thenReturn(studentId);
    when(timetable.getLesson_id()).thenReturn(timetableId);

    ResponseEntity<?> response = presenceController.createPresence(request);
    Presence presence = (Presence) response.getBody();

    assertEquals(200, response.getStatusCodeValue());
    assertEquals(Date.valueOf(LocalDate.now()), presence.getDate());
    assertEquals(request.getStudentId(), presence.getStudent().getId());
    assertEquals(request.getLessonId(),presence.getLesson().getLesson_id());
    verify(presenceRepository).save(any(Presence.class));

  }

  @Test
  public void testGetAllPresences() {
    Presence presence = mock(Presence.class);
    Presence presence2 = mock(Presence.class);
    List<Presence>  presences = List.of(presence, presence2);
    when(presenceRepository.findAll()).thenReturn(presences);
    ResponseEntity<?> response = presenceController.getAllPresences();
    assertEquals(200, response.getStatusCodeValue());
    assertEquals(presences, response.getBody());
  }

  @Test
  public void testGetPresences () {
    Integer studentId = 14;
    Student student = mock(Student.class);

    Presence presence = mock(Presence.class);
    Presence presence2 = mock(Presence.class);
    List<Presence>  presences = List.of(presence, presence2);

    when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
    when(presenceRepository.findByStudent(student)).thenReturn(presences);

    ResponseEntity<?> response = presenceController.getPresences(studentId);
    List <Presence> presences2 = (List<Presence>) response.getBody();

    assertEquals(200, response.getStatusCodeValue());
    assertEquals(presences, presences2);
  }

}
