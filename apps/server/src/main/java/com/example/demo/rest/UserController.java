package com.example.demo.rest;

import com.example.demo.dao.UserRepository;
import com.example.demo.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

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
