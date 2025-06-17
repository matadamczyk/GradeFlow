package EntityTests;

import com.example.demo.entity.User;
import com.example.demo.entity.Role;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class UserTests {

  @Test
  void shouldSetAndGetId() {
    User user = new User();
    user.setId(10);
    assertEquals(10, user.getId());
  }

  @Test
  void shouldSetAndGetEmail() {
    User user = new User();
    user.setEmail("test@example.com");
    assertEquals("test@example.com", user.getEmail());
  }

  @Test
  void shouldSetAndGetPassword() {
    User user = new User();
    user.setPassword("securePassword123");
    assertEquals("securePassword123", user.getPassword());
  }

  @Test
  void shouldSetAndGetRole() {
    User user = new User();
    Role role = Role.ADMIN; // przykładowa wartość, dostosuj do Twojego enum Role
    user.setRole(role);
    assertEquals(role, user.getRole());
  }

  @Test
  void constructorShouldInitializeFields() {
    Role role = Role.PARENT; // przykładowa wartość
    User user = new User(1, "user@example.com", "pass123", role);

    assertEquals(1, user.getId());
    assertEquals("user@example.com", user.getEmail());
    assertEquals("pass123", user.getPassword());
    assertEquals(role, user.getRole());
  }
}
