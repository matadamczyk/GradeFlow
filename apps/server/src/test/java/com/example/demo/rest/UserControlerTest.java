package com.example.demo.rest;

import com.example.demo.dao.GradeRepository;
import com.example.demo.dao.UserRepository;
import com.example.demo.dto.LoginRequest;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.stubbing.OngoingStubbing;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
@ActiveProfiles("test")
public class UserControlerTest {

  private User testUser = new User(1,"mail@gmail.com","pass", Role.ADMIN);
  private UserController userController;

  @Mock
  private UserRepository userRepository;

  @Mock
  private PasswordEncoder passwordEncoder;

  @Mock
  private JwtUtil jwtUtil;

  @BeforeEach
  public void setUp() {
    testUser.setEmail("mail@gmail.com");
    testUser.setPassword("pass");
    testUser.setId(1);
    testUser.setRole(Role.ADMIN);

    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(testUser, "password");
    SecurityContextHolder.getContext().setAuthentication(authenticationToken);


    userController = new UserController();

    ReflectionTestUtils.setField(userController, "userRepository", userRepository);
    ReflectionTestUtils.setField(userController, "passwordEncoder", passwordEncoder);
    ReflectionTestUtils.setField(userController, "jwtUtil", jwtUtil);
  }

  @Test
  @WithUserDetails
  public void testRegister() {
    String mail=testUser.getEmail();
    ResponseEntity<String> response = ResponseEntity.ok("User registered");

    when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.empty());

    assertEquals(response, userController.register(testUser));
  }

  @Test
  @WithUserDetails
  public void testRegisterMailTaken() {
    ResponseEntity<String> response = ResponseEntity.badRequest().body("Email already in use");

    when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));

    assertEquals(response, userController.register(testUser));
  }

  @Test
  @WithUserDetails
  public void testLogin() {
    LoginRequest loginRequest = mock(LoginRequest.class);
    String token = "test token";

    when(loginRequest.getEmail()).thenReturn(testUser.getEmail());
    when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
    when(loginRequest.getPassword()).thenReturn(testUser.getPassword());
    when(passwordEncoder.matches(loginRequest.getPassword(), testUser.getPassword())).thenReturn(true);
    when(jwtUtil.generateToken(testUser.getEmail(), testUser.getRole().toString(), (long) testUser.getId())).thenReturn(token);

    ResponseEntity<?> response = userController.login(loginRequest);

    assertEquals(200, response.getStatusCodeValue());

    Map<String, Object> responseStr = new HashMap<>();
    responseStr.put("token", token);
    responseStr.put("user", Map.of(
      "id", testUser.getId(),
      "email", testUser.getEmail(),
      "role", testUser.getRole()
    ));

    assertEquals(ResponseEntity.ok(responseStr), userController.login(loginRequest));
  }

  @Test
  @WithUserDetails
  public void testLoginWrongEmail() {
    LoginRequest loginRequest = mock(LoginRequest.class);

    when(loginRequest.getEmail()).thenReturn(testUser.getEmail());
    when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.empty());
    ResponseEntity<?> response = userController.login(loginRequest);

    assertEquals(ResponseEntity.status(401).body("Invalid email"), response);
  }

  @Test
  @WithUserDetails
  public void testLoginWrongPassword() {
    LoginRequest loginRequest = mock(LoginRequest.class);

    when(loginRequest.getEmail()).thenReturn(testUser.getEmail());
    when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
    when(loginRequest.getPassword()).thenReturn(testUser.getPassword());
    when(passwordEncoder.matches(loginRequest.getPassword(), testUser.getPassword())).thenReturn(false);

    assertEquals(ResponseEntity.status(401).body("Invalid password"), userController.login(loginRequest));
  }

  @Test
  @WithUserDetails
  public void testAddUser() {
    String encodedPassword = "encoded pass";
    when(passwordEncoder.encode(testUser.getPassword())).thenReturn(encodedPassword);

    when(userRepository.save(testUser)).thenReturn(testUser);

    assertEquals(testUser, userController.addUser(testUser));
  }

  @Test
  @WithUserDetails
  public void testgetAllUsers() {
    when(userRepository.findAll()).thenReturn(List.of(testUser));
    assertEquals(List.of(testUser), userController.getAllUsers());
  }

  @Test
  @WithUserDetails
  public void testGetUserById() {
    when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));

    ResponseEntity<User> response = userController.getUserById(testUser.getId());

    assertEquals(testUser, response.getBody());
    assertEquals(200, response.getStatusCodeValue());
  }

  @Test
  @WithUserDetails
  public void testGetUserByIdNotInDataBase() {
    when(userRepository.findById(testUser.getId())).thenReturn(Optional.empty());

    ResponseEntity<User> response = userController.getUserById(testUser.getId());

    assertNull(response.getBody());
    assertEquals(404, response.getStatusCodeValue());
  }

  @Test
  @WithUserDetails
  public void testUpdateUser() {
    Integer tmpId = 10;
    String newMail = "newMail";
    String password = "pass";
    String newPassword = "pass new";
    String encodedPassword = "encoded new pass";
    User tmpUser = new User(tmpId,"mail", password, Role.STUDENT);

    when(userRepository.findById(tmpId)).thenReturn(Optional.of(tmpUser));
    when(passwordEncoder.encode(newPassword)).thenReturn(encodedPassword);

    User updatedUser = new User(tmpId,newMail, newPassword, Role.TEACHER);
    when(userRepository.save(any(User.class))).thenReturn(updatedUser);

    ResponseEntity<User> response = userController.updateUser(tmpId, updatedUser);

    assertEquals(200, response.getStatusCodeValue());

    assertNotNull( response.getBody());
    assertEquals(newMail, response.getBody().getEmail());
    assertEquals(newPassword, response.getBody().getPassword());
    assertEquals(Role.TEACHER, response.getBody().getRole());
  }

  @Test
  @WithUserDetails
  public void testUpdateUserNotFound() {
    Integer tmpId = 10;
    String newMail = "newMail";
    String newPassword = "pass new";

    User updateUser = new User(tmpId,newMail, newPassword, Role.TEACHER);

    when(userRepository.findById(tmpId)).thenReturn(Optional.empty());

    ResponseEntity<User> response = userController.updateUser(tmpId, updateUser);

    assertEquals(404, response.getStatusCodeValue());
    assertNull(response.getBody());
  }

  @Test
  @WithUserDetails
  public void testDeleteUser() {
    Integer tmpId = 10;
    String mail = "mail";
    String password = "pass";
    User tmpUser = new User(tmpId,mail, password, Role.STUDENT);

    when(userRepository.existsById(tmpId)).thenReturn(true);

    ResponseEntity<Void> response = userController.deleteUser(tmpId);

    assertEquals(204, response.getStatusCodeValue());
    verify(userRepository).deleteById(tmpId);
  }

  @Test
  @WithUserDetails
  public void testDeleteUserNotFound() {
    Integer tmpId = 10;
    String mail = "mail";
    String password = "pass";
    User tmpUser = new User(tmpId,mail, password, Role.STUDENT);

    when(userRepository.existsById(tmpId)).thenReturn(false);
    ResponseEntity<Void> response = userController.deleteUser(tmpId);

    assertEquals(404, response.getStatusCodeValue()); // No Content
    verify(userRepository, never()).deleteById(anyInt());
  }

}


