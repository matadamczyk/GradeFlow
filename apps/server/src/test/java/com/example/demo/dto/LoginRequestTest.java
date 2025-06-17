package com.example.demo.dto;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class LoginRequestTest {

  private String email = "email1";
  private String password = "password1";
  private LoginRequest loginRequest;

  @BeforeEach
  public void setUp() {
    loginRequest=new LoginRequest();
    loginRequest.setEmail(email);
    loginRequest.setPassword(password);
  }

  @Test
  public void getEmail() {
    assertEquals(email,loginRequest.getEmail());
  }

  @Test
  public void getPassword() {
    assertEquals(password,loginRequest.getPassword());
  }

  @Test
  public void setEmail() {
    String newEmail="email2";
    loginRequest.setEmail(newEmail);
    assertEquals(newEmail,loginRequest.getEmail());
  }

  @Test
  public void setPassword() {
    String newPassword="password2";
    loginRequest.setPassword(newPassword);
    assertEquals(newPassword,loginRequest.getPassword());
  }
}
