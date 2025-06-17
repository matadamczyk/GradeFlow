package com.example.demo.dao;

import com.example.demo.entity.StudentClass;
import com.example.demo.entity.Timetable;
import com.example.demo.entity.WorkDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Time;
import java.util.List;

public interface TimetableRepository extends JpaRepository<Timetable, Integer> {
    List<Timetable> findByStudentClass(StudentClass studentClass);
    
    @Query("SELECT t FROM Timetable t WHERE t.teacherSubject.teacher.id = :teacherId")
    List<Timetable> findByTeacherId(@Param("teacherId") Integer teacherId);
}
