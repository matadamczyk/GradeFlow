package com.example.demo.dao;

import com.example.demo.entity.Presence;
import com.example.demo.entity.Student;
import com.example.demo.entity.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Date;
import java.util.Optional;

public interface PresenceRepository extends JpaRepository<Presence, Integer> {
  Optional<Presence> findByStudentAndLessonAndDate(Student student, Timetable lesson, Date date);
}
