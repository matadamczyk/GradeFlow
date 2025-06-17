package com.example.demo.rest;

import com.example.demo.dto.StudentRequest;
import com.example.demo.service.EmailService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;


@RequestMapping("/contact")
@RestController
public class ContactController {

    private final EmailService emailService;
    private final StudentController studentController;

    public ContactController(EmailService emailService, StudentController studentController) {
        this.emailService = emailService;
        this.studentController = studentController;
    }

    @PreAuthorize("permitAll()") // Umożliwia dostęp wszystkim użytkownikom
    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(@RequestBody Map<String, String> request) {
        
        try {
        String to = request.get("email");
        String name = request.get("name");
        String firstName = name.split(" ")[0];
        String lastName = name.split(" ")[1];
        // Integer classId = 76;

        // StudentRequest studentRequest = new StudentRequest();
        // studentRequest.setName(firstName);
        // studentRequest.setLastname(lastName);
        // studentRequest.setClassid(classId);
        // studentController.createStudent(studentRequest);

        String generatedPassword = UUID.randomUUID().toString().replace("-", "").substring(0, 8);

        emailService.sendEmail(to, to, generatedPassword);

        return ResponseEntity.ok("Email sent successfully");

    } catch (Exception e) {
        System.out.println("Błąd przy przetwarzaniu danych wejściowych");
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("Błąd serwera: " + e.getMessage());
    }
}
}