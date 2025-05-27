package com.example.demo.dao;

import com.example.demo.entity.TeacherSubject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherSubjectRepository extends JpaRepository<TeacherSubject, Integer> {
}
