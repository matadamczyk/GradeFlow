package com.example.demo.dao;

import com.example.demo.entity.Timetable;
import com.example.demo.entity.WorkDay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimetableRepository extends JpaRepository<Timetable, Integer> {
  // Pobierz lekcje dla danej klasy i dnia
  List<Timetable> findByStudentClassIdAndDay(Integer classId, WorkDay day);
}
