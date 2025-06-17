package com.example.demo.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

public class SubjecTest {
  private Subject subject;
  private final Integer id = 6;
  private final String name = "Sub1";

  @BeforeEach
  public void setUp() {
    subject = new Subject(id, name);
  }

  @Test
  public void testGetId() {
    assertEquals(id, subject.getId());
  }

  @Test
  public void testGetName() {
    assertEquals(name, subject.getName());
  }

  @Test
  public void testSetId() {
    Integer newId = 7;
    subject.setId(newId);
    assertEquals(newId, subject.getId());
  }

  @Test
  public void testSetName() {
    String newName = "Sub2";
    subject.setName(newName);
    assertEquals(newName, subject.getName());
  }
  @Test
  public void testDefaultConstructor() {
    Subject emptySub= new Subject();
    assertAll(
      ()->assertNull(emptySub.getId()),
      ()->assertNull(emptySub.getName())
    );
  }
}
