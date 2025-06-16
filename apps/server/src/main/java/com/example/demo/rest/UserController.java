package com.example.demo.rest;

import com.example.demo.dao.UserRepository;
import com.example.demo.dto.LoginRequest;
import com.example.demo.entity.User;
import com.example.demo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private JwtUtil jwtUtil;

  @PostMapping("/register")
  public ResponseEntity<String> register(@RequestBody User user) {
    if (userRepository.findByEmail(user.getEmail()).isPresent()) {
      return ResponseEntity.badRequest().body("Email already in use");
    }

    // Hash password before saving
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    userRepository.save(user);
    return ResponseEntity.ok("User registered");
  }

  // Login: check credentials
  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
    Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());

    if (userOpt.isEmpty()) {
      return ResponseEntity.status(401).body("Invalid email");
    }

    User user = userOpt.get();

    // Check hashed password match
    if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
      // Generate JWT token
      String token = jwtUtil.generateToken(user.getEmail(), user.getRole().toString(), (long) user.getId());

      // Return token and user info
      Map<String, Object> response = new HashMap<>();
      response.put("token", token);
      response.put("user", Map.of(
        "id", user.getId(),
        "email", user.getEmail(),
        "role", user.getRole()
      ));

      return ResponseEntity.ok(response);
    } else {
      return ResponseEntity.status(401).body("Invalid password");
    }
  }

  // CREATE
  @PostMapping
  public User addUser(@RequestBody User user) {
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    return userRepository.save(user);
  }

  // READ ALL
  @GetMapping
  public List<User> getAllUsers() {
    return userRepository.findAll();
  }

  // READ ONE
  @GetMapping("/{id}")
  public ResponseEntity<User> getUserById(@PathVariable int id) {
    return userRepository.findById(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  // UPDATE
  @PutMapping("/{id}")
  public ResponseEntity<User> updateUser(@PathVariable int id, @RequestBody User userDetails) {
    return userRepository.findById(id)
      .map(user -> {
        user.setEmail(userDetails.getEmail());
        user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        user.setRole(userDetails.getRole());
        return ResponseEntity.ok(userRepository.save(user));
      })
      .orElse(ResponseEntity.notFound().build());
  }

  // DELETE
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteUser(@PathVariable int id) {
    if (!userRepository.existsById(id)) {
      return ResponseEntity.notFound().build();
    }
    userRepository.deleteById(id);
    return ResponseEntity.noContent().build();
  }

}
