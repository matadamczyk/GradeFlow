package com.example.demo.service;

import com.example.demo.dao.PresenceRepository;
import com.example.demo.dao.StudentRepository;
import com.example.demo.dao.TimetableRepository;
import com.example.demo.entity.Presence;
import com.example.demo.entity.Student;
import com.example.demo.entity.Timetable;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.Optional;

@Service
public class PresenceService {

  private final PresenceRepository presenceRepository;
  private final StudentRepository studentRepository;
  private final TimetableRepository timetableRepository;

  public PresenceService(PresenceRepository presenceRepository,
                         StudentRepository studentRepository,
                         TimetableRepository timetableRepository) {
    this.presenceRepository = presenceRepository;
    this.studentRepository = studentRepository;
    this.timetableRepository = timetableRepository;
  }

  public Presence markAbsence(Integer studentId, Integer lessonId, Date date) {
    Student student = studentRepository.findById(studentId)
      .orElseThrow(() -> new IllegalArgumentException("Student not found"));
    Timetable lesson = timetableRepository.findById(lessonId)
      .orElseThrow(() -> new IllegalArgumentException("Lesson not found"));

    Optional<Presence> existing = presenceRepository.findByStudentAndLessonAndDate(student, lesson, date);
    if (existing.isPresent()) {
      throw new IllegalStateException("Absence already recorded");
    }

    Presence presence = new Presence();
    presence.setStudent(student);
    presence.setLesson(lesson);
    presence.setDate(date);

    return presenceRepository.save(presence);
  }

  public boolean isAbsent(Integer studentId, Integer lessonId, Date date) {
    Student student = studentRepository.findById(studentId)
      .orElseThrow(() -> new IllegalArgumentException("Student not found"));
    Timetable lesson = timetableRepository.findById(lessonId)
      .orElseThrow(() -> new IllegalArgumentException("Lesson not found"));

    return presenceRepository.findByStudentAndLessonAndDate(student, lesson, date).isPresent();
  }
}
