package com.example.demo.rest;

import com.example.demo.dao.*;
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
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.mock;


@ExtendWith(MockitoExtension.class)
@SpringBootTest
@ActiveProfiles("test")
public class EventControllerTest {
  private User testUser = new User(1,"mail@gmail.com","pass", Role.ADMIN);
  private EventController eventController;

  @Mock
  private ScheduleRepository scheduleRepository;
  @Mock
  private TimetableRepository timetableRepository;
  @Mock
  private StudentClassRepository studentClassRepository;
  @Mock
  private TeacherRepository teacherRepository;


  @BeforeEach
  public void setUp() {
    testUser.setEmail("mail@gmail.com");
    testUser.setPassword("pass");
    testUser.setId(1);
    testUser.setRole(Role.ADMIN);

    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(testUser, "password");
    SecurityContextHolder.getContext().setAuthentication(authenticationToken);


    eventController = new EventController();

    ReflectionTestUtils.setField(eventController, "studentClassRepository", studentClassRepository);
    ReflectionTestUtils.setField(eventController, "teacherRepository", teacherRepository);
    ReflectionTestUtils.setField(eventController, "timetableRepository", timetableRepository);
    ReflectionTestUtils.setField(eventController, "scheduleRepository", scheduleRepository);
  }

  @Test
  public void testGetEventsByClass () {
    Integer classId = 11;
    StudentClass studentClass = mock(StudentClass.class);

    when(studentClassRepository.findById(classId)).thenReturn(Optional.of(studentClass));

    Timetable timetable = mock(Timetable.class);
    Timetable timetable2 = mock(Timetable.class);
    List<Timetable> timetables = Arrays.asList(timetable, timetable2);
    when(timetableRepository.findByStudentClass(studentClass)).thenReturn(timetables);

    Schedule schedule = mock(Schedule.class);
    Schedule schedule2 = mock(Schedule.class);
    List<Schedule> schedules = Arrays.asList(schedule, schedule2);
    when(scheduleRepository.findByLessonIn(timetables)).thenReturn(schedules);

    ResponseEntity<?> response = eventController.getEventsByClass(classId);
    List<Schedule> scheduleResponse = (List<Schedule>) response.getBody();

    assertEquals(200, response.getStatusCodeValue());
    assertEquals(scheduleResponse, schedules);
  }

  @Test
  public void testGetAllEvents() {
    Schedule schedule = mock(Schedule.class);
    Schedule schedule2 = mock(Schedule.class);
    List<Schedule> schedules = Arrays.asList(schedule, schedule2);

    when(scheduleRepository.findAll()).thenReturn(schedules);

    ResponseEntity<?> response = eventController.getAllEvents();
    List<Schedule> scheduleResponse = (List<Schedule>) response.getBody();
    assertEquals(200, response.getStatusCodeValue());
    assertEquals(scheduleResponse, schedules);

  }

  @Test
  public void testDeleteEvent () {
    Integer eventId = 16;
    Schedule schedule = mock(Schedule.class);
    when(scheduleRepository.findById(eventId)).thenReturn(Optional.of(schedule));
    ResponseEntity<?> response = eventController.deleteEvent(eventId);
    assertEquals(200, response.getStatusCodeValue());
    assertEquals(schedule, response.getBody());
    verify(scheduleRepository).delete(schedule);

  }

  @Test
  public void testCreateEvent() {
    Integer classId = 11;
    Map<String, Object> eventData = new HashMap<>();
    eventData.put("title", "Test Event");
    eventData.put("description", "Test Description");
    eventData.put("classId", classId);
    eventData.put("date", "2025-06-18");


    StudentClass studentClass = mock(StudentClass.class);

    when(studentClassRepository.findById(classId)).thenReturn(Optional.of(studentClass));
    Timetable timetable = mock(Timetable.class);
    Timetable timetable2 = mock(Timetable.class);
    List<Timetable> timetables = Arrays.asList(timetable, timetable2);
    when(timetableRepository.findByStudentClass(studentClass)).thenReturn(timetables);
    when(scheduleRepository.save(any(Schedule.class))).thenAnswer(invocation -> invocation.getArgument(0));;

    ResponseEntity<?> response = eventController.createEvent(eventData);
    Schedule schedule = (Schedule) response.getBody();

    assertEquals(200, response.getStatusCodeValue());
    assertEquals(eventData.get("title"), schedule.getTitle());
    verify(scheduleRepository).save(any(Schedule.class));
  }

  @Test
  public void testCreateEventNoDate() {
    Integer classId = 11;
    Map<String, Object> eventData = new HashMap<>();
    eventData.put("title", "Test Event");
    eventData.put("description", "Test Description");
    eventData.put("classId", classId);

    StudentClass studentClass = mock(StudentClass.class);

    when(studentClassRepository.findById(classId)).thenReturn(Optional.of(studentClass));
    Timetable timetable = mock(Timetable.class);
    Timetable timetable2 = mock(Timetable.class);
    List<Timetable> timetables = Arrays.asList(timetable, timetable2);
    when(timetableRepository.findByStudentClass(studentClass)).thenReturn(timetables);
    when(scheduleRepository.save(any(Schedule.class))).thenAnswer(invocation -> invocation.getArgument(0));;

    ResponseEntity<?> response = eventController.createEvent(eventData);
    Schedule schedule = (Schedule) response.getBody();

    assertEquals(200, response.getStatusCodeValue());
    assertEquals(eventData.get("title"), schedule.getTitle());
    assertEquals(Date.valueOf(LocalDate.now()), schedule.getDate());
    verify(scheduleRepository).save(any(Schedule.class));
  }

  @Test
  public void testCreateEventNoTimetables() {
    Integer classId = 11;
    Map<String, Object> eventData = new HashMap<>();
    eventData.put("title", "Test Event");
    eventData.put("description", "Test Description");
    eventData.put("classId", classId);
    eventData.put("date", "2025-06-18");


    StudentClass studentClass = mock(StudentClass.class);

    when(studentClassRepository.findById(classId)).thenReturn(Optional.of(studentClass));
    Timetable timetable = mock(Timetable.class);
    Timetable timetable2 = mock(Timetable.class);
    List<Timetable> timetables = Arrays.asList(timetable, timetable2);
    when(timetableRepository.findByStudentClass(studentClass)).thenReturn(List.of());

    Exception exception = assertThrows(IllegalArgumentException.class,
      ()->eventController.createEvent(eventData));
    assertEquals("No timetables found for class", exception.getMessage());
  }
}
