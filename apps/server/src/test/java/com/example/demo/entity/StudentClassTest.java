package com.example.demo.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

public class StudentClassTest {
  private StudentClass studentClass = new StudentClass();
  private final Integer id=9;
  private final Character letter='F';
  private final Byte number=10;
  private final Teacher teacher=mock(Teacher.class);

  @Test
  public void studentClassTestSettersGetters() {
    studentClass.setId(id);
    studentClass.setLetter(letter);
    studentClass.setNumber(number);
    studentClass.setTutor(teacher);

    assertAll(
      ()->assertEquals(id, studentClass.getId()),
      ()->assertEquals(letter,studentClass.getLetter()),
      ()->assertEquals(number,studentClass.getNumber()),
      ()->assertEquals(teacher,studentClass.getTutor())
    );
  }

  @Test
  public void studentClassTestGetClassName() {
    String str = "" + studentClass.getNumber() + studentClass.getLetter();
    assertEquals(str, studentClass.getClassName());
  }

  @Test
  public void studentClassTestSetClassName() {
    Character newletter='B';
    Byte newnumber=2;
    studentClass.setClassName(newletter, newnumber);
    assertEquals("" + newnumber + newletter, studentClass.getClassName());
  }

}
