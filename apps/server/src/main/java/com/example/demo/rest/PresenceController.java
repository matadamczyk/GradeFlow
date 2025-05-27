package com.example.demo.rest;

import com.example.demo.entity.Presence;
import com.example.demo.service.PresenceService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Date;

@RestController
@RequestMapping("/api/presence")
public class PresenceController {

  private final PresenceService presenceService;

  public PresenceController(PresenceService presenceService) {
    this.presenceService = presenceService;
  }

  // Zaznaczenie nieobecności
  @PostMapping("/mark")
  public Presence markAbsence(@RequestParam Integer studentId,
                              @RequestParam Integer lessonId,
                              @RequestParam Date date) {
    return presenceService.markAbsence(studentId, lessonId, date);
  }

  // Sprawdzenie, czy uczeń był nieobecny
  @GetMapping("/isAbsent")
  public boolean isAbsent(@RequestParam Integer studentId,
                          @RequestParam Integer lessonId,
                          @RequestParam Date date) {
    return presenceService.isAbsent(studentId, lessonId, date);
  }
}
