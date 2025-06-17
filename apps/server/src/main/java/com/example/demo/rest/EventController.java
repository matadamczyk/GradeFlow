package com.example.demo.rest;

import com.example.demo.dao.ScheduleRepository;
import com.example.demo.dao.StudentClassRepository;
import com.example.demo.dao.TeacherRepository;
import com.example.demo.dao.TimetableRepository;
import com.example.demo.entity.Schedule;
import com.example.demo.entity.StudentClass;
import com.example.demo.entity.Teacher;
import com.example.demo.entity.Timetable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private TimetableRepository timetableRepository;

    @Autowired
    private StudentClassRepository studentClassRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    // Map events to schedules for frontend compatibility
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN') or hasRole('STUDENT') or hasRole('PARENT')")
    @GetMapping("/class/{classId}")
    public ResponseEntity<List<Schedule>> getEventsByClass(@PathVariable Integer classId) {
        StudentClass studentClass = studentClassRepository.findById(classId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid class ID"));

        // Get all timetables for this class, then find schedules for those timetables
        List<Timetable> classTimetables = timetableRepository.findByStudentClass(studentClass);
        List<Schedule> events = scheduleRepository.findByLessonIn(classTimetables);
        
        return ResponseEntity.ok(events);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    @GetMapping
    public ResponseEntity<List<Schedule>> getAllEvents() {
        List<Schedule> events = scheduleRepository.findAll();
        return ResponseEntity.ok(events);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    @PostMapping("/create")
    public ResponseEntity<Schedule> createEvent(@RequestBody Map<String, Object> eventData) {
        // Extract data from the request
        String title = (String) eventData.get("title");
        String description = (String) eventData.get("description");
        Integer classId = (Integer) eventData.get("classId");
        String dateStr = (String) eventData.get("date");

        // Find the class
        StudentClass studentClass = studentClassRepository.findById(classId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid class ID"));

        // For now, find any timetable for this class to link the schedule
        // In a real scenario, you'd want to select a specific lesson
        List<Timetable> classTimetables = timetableRepository.findByStudentClass(studentClass);
        if (classTimetables.isEmpty()) {
            throw new IllegalArgumentException("No timetables found for class");
        }
        Timetable lesson = classTimetables.get(0); // Take first available

        // Parse date
        Date date;
        try {
            date = Date.valueOf(LocalDate.parse(dateStr));
        } catch (Exception e) {
            date = Date.valueOf(LocalDate.now());
        }

        // Create and save schedule
        Schedule schedule = new Schedule(null, lesson, date, title, description);
        Schedule saved = scheduleRepository.save(schedule);

        return ResponseEntity.ok(saved);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    @PutMapping("/update/{eventId}")
    public ResponseEntity<Schedule> updateEvent(@PathVariable Integer eventId, @RequestBody Map<String, Object> eventData) {
        Schedule schedule = scheduleRepository.findById(eventId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid event ID"));

        // Update fields
        String title = (String) eventData.get("title");
        String description = (String) eventData.get("description");
        String dateStr = (String) eventData.get("date");

        if (title != null) {
            schedule.setTitle(title);
        }
        if (description != null) {
            schedule.setComment(description);
        }
        if (dateStr != null) {
            try {
                Date date = Date.valueOf(LocalDate.parse(dateStr));
                schedule.setDate(date);
            } catch (Exception e) {
                // Keep existing date if parsing fails
            }
        }

        Schedule updated = scheduleRepository.save(schedule);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    @DeleteMapping("/delete/{eventId}")
    public ResponseEntity<Schedule> deleteEvent(@PathVariable Integer eventId) {
        Schedule schedule = scheduleRepository.findById(eventId)
            .orElseThrow(() -> new IllegalArgumentException("Invalid event ID"));

        scheduleRepository.delete(schedule);
        return ResponseEntity.ok(schedule);
    }
} 