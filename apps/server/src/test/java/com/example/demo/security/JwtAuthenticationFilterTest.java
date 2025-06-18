package com.example.demo.security;
import com.example.demo.dao.*;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.rest.EventController;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.lenient;

import static org.mockito.Mockito.*;
import static org.mockito.Mockito.mock;


@ExtendWith(MockitoExtension.class)
@SpringBootTest
@ActiveProfiles("test")
public class JwtAuthenticationFilterTest {
  private User testUser = new User(1,"mail@gmail.com","pass", Role.ADMIN);
  private JwtAuthenticationFilter filter;

  @Mock
  private JwtUtil jwtUtil;
  @Mock
  private UserRepository userRepository;


  @BeforeEach
  public void setUp() {
    testUser.setEmail("mail@gmail.com");
    testUser.setPassword("pass");
    testUser.setId(1);
    testUser.setRole(Role.ADMIN);

    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(testUser, "password");
//    SecurityContextHolder.getContext().setAuthentication(authenticationToken);


    filter = new JwtAuthenticationFilter();

    ReflectionTestUtils.setField(filter, "jwtUtil", jwtUtil);
    ReflectionTestUtils.setField(filter, "userRepository", userRepository);
  }

  @Test
  public void testdoFilterInternalLogin() throws ServletException, IOException {
    HttpServletRequest request = mock(HttpServletRequest.class);
    HttpServletResponse response = mock(HttpServletResponse.class);
    FilterChain chain = mock(FilterChain.class);

    when(request.getHeader("Authorization")).thenReturn("test");
    when(request.getRequestURI()).thenReturn("/api/users/login");

    filter.doFilterInternal(request,response,chain);
    verify(chain, times(1)).doFilter(request, response);
  }

  @Test
  public void testdoFilterInternal() throws ServletException, IOException {
    HttpServletRequest request = mock(HttpServletRequest.class);
    HttpServletResponse response = mock(HttpServletResponse.class);
    FilterChain chain = mock(FilterChain.class);

    String jwt = "valid.jwt.token";
    String email = "user@example.com";
    String uri = "/api/secure/resource";


    when(request.getHeader("Authorization")).thenReturn("Bearer "+jwt);
    when(request.getRequestURI()).thenReturn(uri);
    when(jwtUtil.extractUsername(jwt)).thenReturn(email);
    when(jwtUtil.validateToken(jwt, email)).thenReturn(true);
    when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUser));

    try {
      filter.doFilterInternal(request, response, chain);

      verify(chain, times(1)).doFilter(request, response);
      assertNotNull(SecurityContextHolder.getContext().getAuthentication());
      assertEquals(testUser, SecurityContextHolder.getContext().getAuthentication().getPrincipal());
      assertEquals("ROLE_ADMIN", SecurityContextHolder.getContext().getAuthentication().getAuthorities().iterator().next().getAuthority());
    }
    finally {}
  }
}
