package DtoRequestTests;

import com.example.demo.dto.LoginRequest;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class LoginRequestTests {

  @Test
  void shouldSetAndGetEmail() {
    LoginRequest request = new LoginRequest();
    String email = "test@example.com";
    request.setEmail(email);
    assertEquals(email, request.getEmail());
  }

  @Test
  void shouldSetAndGetPassword() {
    LoginRequest request = new LoginRequest();
    String password = "securePassword123";
    request.setPassword(password);
    assertEquals(password, request.getPassword());
  }
}
