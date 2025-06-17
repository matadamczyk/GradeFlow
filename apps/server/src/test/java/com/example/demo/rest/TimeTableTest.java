package com.example.demo.rest;


import com.example.demo.dao.*;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
@ActiveProfiles("test")
public class TimeTableTest {
  private User testUser = new User(1,"mail@gmail.com","pass", Role.ADMIN);
  private TimetableController timetableController;

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
  }


}
