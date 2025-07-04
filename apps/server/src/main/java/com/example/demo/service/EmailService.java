package com.example.demo.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String username, String password, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("gradeflow25@gmail.com"); // Dodaj from field
        message.setTo(to);
        message.setSubject("[nowe konto] " + username);
        message.setText(text + "\nHasło: " + password);
        mailSender.send(message);
    }

    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("gradeflow25@gmail.com"); // Dodaj from field
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}
