package com.example.demo.rest;

import com.example.demo.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RequestMapping("/api/contact")
@RestController
public class ContactController {
    private final EmailService emailService;

    @Autowired
    public ContactController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/send")
    public ResponseEntity<Map<String, String>> sendEmail(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String name = request.get("name");
            String subject = request.get("subject");
            String message = request.get("message");

            if (email == null || name == null || subject == null || message == null) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "All fields are required");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            String emailSubject = "Nowa wiadomość kontaktowa od: " + name;
            String emailBody = String.format(
                "Wiadomość od: %s (%s)\n" +
                "Temat: %s\n\n" +
                "Treść:\n%s",
                name, email, subject, message
            );
            
            emailService.sendEmail("gradeflow25@gmail.com", emailSubject, emailBody);
            
            Map<String, String> successResponse = new HashMap<>();
            successResponse.put("message", "Wiadomość wysłana pomyślnie");
            successResponse.put("status", "success");
            return ResponseEntity.ok(successResponse);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Server error: " + e.getMessage());
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(errorResponse);
        }
    }
}
