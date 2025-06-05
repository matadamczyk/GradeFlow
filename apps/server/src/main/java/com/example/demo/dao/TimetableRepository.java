package com.example.demo.dao;

import com.example.demo.entity.StudentClass;
import com.example.demo.entity.Timetable;
import com.example.demo.entity.WorkDay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Time;
import java.util.List;

public interface TimetableRepository extends JpaRepository<Timetable, Integer> {
    List<Timetable> findByStudentClass(StudentClass studentClass);
}
