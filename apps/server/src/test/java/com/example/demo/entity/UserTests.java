package com.example.demo.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertNull;

public class UserTests {

  private User user;
  private final int id = 5;
  private final String email = "mail@gamil.com";
  private final String password = "pass";
  private final Role role = Role.STUDENT;

  @BeforeEach
  protected void setUp() {
    user = new User(id,email,password, role);
  }

  @Test
  public void TestGetId() {
    assertEquals(id,user.getId());
  }

  @Test
  public void TestGetEmail() {
    assertEquals(email,user.getEmail());
  }

  @Test
  public void TestGetPassword() {
    assertEquals(password,user.getPassword());
  }

  @Test
  public void TestSetId() {
    int newId = 1;
    user.setId(newId);
    assertEquals(newId,user.getId());
  }

  @Test
  public void TestSetEmail() {
    String newEmail = "newmail@gmail.com";
    user.setEmail(newEmail);
    assertEquals(newEmail,user.getEmail());
  }

  @Test
  public void TestSetPassword() {
    String newPassword = "newpass";
    user.setPassword(newPassword);
    assertEquals(newPassword,user.getPassword());
  }

  @Test
  public void TestToString() {
    String toString = "User{" +
      "id=" + id +
      ", email='" + email + '\'' +
      ", password='" + password + '\'' +
      ", role=" + role +
      '}';
    assertEquals(toString,user.toString());
  }

  @Test
  public void TestSetRole() {
    Role newRole = Role.TEACHER;
    user.setRole(newRole);
    assertEquals(newRole,user.getRole());
  }

  @Test
  public void TestGetRole() {
    assertEquals(role,user.getRole());
  }

  @Test
  public void TestDefaultConstructor(){
    User emptyUser = new User();
    assertAll(
      ()->assertNull(emptyUser.getRole()),
      ()->assertNull(emptyUser.getId()),
      ()->assertNull(emptyUser.getEmail()),
      ()->assertNull(emptyUser.getPassword())
    );
  }

}
