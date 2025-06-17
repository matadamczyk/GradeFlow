package com.example.demo.rest;

import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.dao.GradeRepository;
import com.example.demo.dao.UserRepository;
import com.example.demo.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RequestMapping("/api/contact")
@RestController
public class ContactController {
    @Autowired
    private UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public ContactController(EmailService emailService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.emailService = emailService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PreAuthorize("permitAll()") // Allow access to all users
    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String name = request.get("name");

            if (email == null || name == null) {
                return ResponseEntity.badRequest().body("Email and name are required");
            }

            String generatedPassword = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
            User user = new User();
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(generatedPassword));
            user.setRole(Role.STUDENT);

            try {
                userRepository.save(user);
            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException("Failed to save user: " + e.getMessage());
            }

            emailService.sendEmail(email, email, generatedPassword);

            return ResponseEntity.ok("User created and email sent successfully");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Server error: " + e.getMessage());
        }
    }
}