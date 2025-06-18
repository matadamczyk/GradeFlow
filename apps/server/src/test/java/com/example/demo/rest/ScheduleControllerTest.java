package com.example.demo.rest;
import com.example.demo.dao.ScheduleRepository;
import com.example.demo.dao.StudentClassRepository;
import com.example.demo.dao.StudentRepository;
import com.example.demo.dao.TimetableRepository;
import com.example.demo.dto.ScheduleRequest;
import com.example.demo.dto.StudentRequest;
import com.example.demo.entity.*;
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

import java.sql.Date;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
@ActiveProfiles("test")
public class ScheduleControllerTest {
  private User testUser = new User(1,"mail@gmail.com","pass", Role.ADMIN);
  private ScheduleController scheduleController;

  @Mock
  private ScheduleRepository scheduleRepository;
  @Mock
  private TimetableRepository timetableRepository;
  @Mock
  private StudentClassRepository studentClassRepository;

  private ScheduleRequest scheduleRequest = mock(ScheduleRequest.class);


  @BeforeEach
  public void setUp() {
    testUser.setEmail("mail@gmail.com");
    testUser.setPassword("pass");
    testUser.setId(1);
    testUser.setRole(Role.ADMIN);

    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(testUser, "password");
    SecurityContextHolder.getContext().setAuthentication(authenticationToken);


    scheduleController = new ScheduleController();

    ReflectionTestUtils.setField(scheduleController, "timetableRepository", timetableRepository);
    ReflectionTestUtils.setField(scheduleController, "scheduleRepository", scheduleRepository);
    ReflectionTestUtils.setField(scheduleController, "studentClassRepository", studentClassRepository);
  }

  @Test
  public void testGetAllSchedules() {
    Schedule schedule = mock(Schedule.class);
    Schedule schedule2 = mock(Schedule.class);

    List<Schedule> schedules = Arrays.asList(schedule, schedule2);
    when(scheduleRepository.findAll()).thenReturn(schedules);

    ResponseEntity<?> response = scheduleController.getAllSchedules();

    assertEquals(200, response.getStatusCodeValue());
    assertEquals(schedules, response.getBody());

  }

  @Test
  public void testGetSchedulesByClass () {
    Integer classId = 14;
    StudentClass studentClass = mock(StudentClass.class);

    Timetable timetable = mock(Timetable.class);
    Timetable timetable2 = mock(Timetable.class);
    List<Timetable> timetables = Arrays.asList(timetable, timetable2);

    Schedule schedule = mock(Schedule.class);
    Schedule schedule2 = mock(Schedule.class);
    List<Schedule> schedules = Arrays.asList(schedule, schedule2);

    when(studentClassRepository.findById(classId)).thenReturn(Optional.of(studentClass));
    when(timetableRepository.findByStudentClass(studentClass)).thenReturn(timetables);
    when(scheduleRepository.findByLessonIn(timetables)).thenReturn(schedules);

    ResponseEntity<?> response = scheduleController.getSchedulesByClass(classId);
    assertEquals(200, response.getStatusCodeValue());
    assertEquals(schedules, response.getBody());

  }

  @Test
  public void testAddSchedule () {
    Integer lesssonId = 14;
    ScheduleRequest request = new ScheduleRequest();
    request.setDate(Date.valueOf("2012-03-05"));
    request.setTitle("Test Title");
    request.setComment("Test Comment");
    request.setLessonId(lesssonId);

    Timetable timetable = new Timetable();

    when(timetableRepository.findById(lesssonId)).thenReturn(Optional.of(timetable));

    ResponseEntity<?> response = scheduleController.addSchedule(request);
    Schedule schedule = (Schedule) response.getBody();

    assertEquals(200, response.getStatusCodeValue());
    assertEquals(request.getDate(), schedule.getDate());
    assertEquals(request.getTitle(), schedule.getTitle());
    assertEquals(request.getComment(), schedule.getComment());
    verify(scheduleRepository).save(any(Schedule.class));
  }

  @Test
  public void testAddScheduleEmptyDateAndTitle () {
    Integer lesssonId = 14;
    ScheduleRequest request = new ScheduleRequest();
    request.setComment("Test Comment");
    request.setLessonId(lesssonId);

    Timetable timetable = new Timetable();

    when(timetableRepository.findById(lesssonId)).thenReturn(Optional.of(timetable));

    ResponseEntity<?> response = scheduleController.addSchedule(request);
    ResponseEntity<?> predictedResponse = ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Title is required");

    assertEquals(predictedResponse, response);
  }

  @Test
  public void testDeleteSchedule () {
    Integer scheduleId = 14;
    Schedule schedule = mock(Schedule.class);

    when(scheduleRepository.findById(scheduleId)).thenReturn(Optional.of(schedule));

    ResponseEntity<?> response = scheduleController.deleteSchedule(scheduleId);
    Schedule schedule2 = (Schedule) response.getBody();
    assertEquals(200, response.getStatusCodeValue());
    assertEquals(schedule, schedule2);
  }

  @Test
  public void testUpdateSchedule () {
    Integer scheduleId = 14;
    Schedule schedule = mock(Schedule.class);
    Timetable timetable = mock(Timetable.class);

    Integer lesssonId = 14;
    ScheduleRequest request = new ScheduleRequest();
    request.setDate(Date.valueOf("2012-03-05"));
    request.setTitle("Test Title");
    request.setComment("Test Comment");
    request.setLessonId(lesssonId);

    when(scheduleRepository.findById(scheduleId)).thenReturn(Optional.of(schedule));
    when(timetableRepository.findById(lesssonId)).thenReturn(Optional.of(timetable));
    ResponseEntity<?> response = scheduleController.updateSchedule(scheduleId, request);

    Schedule schedule2 = (Schedule) response.getBody();

    assertEquals(200, response.getStatusCodeValue());
    assertEquals(schedule, schedule2);
    verify(scheduleRepository).save(any(Schedule.class));


  }
}
