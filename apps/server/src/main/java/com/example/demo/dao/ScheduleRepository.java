package com.example.demo.dao;

import com.example.demo.entity.Schedule;
import com.example.demo.entity.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {
    List<Schedule> findByLessonIn(List<Timetable> lessons);
}
