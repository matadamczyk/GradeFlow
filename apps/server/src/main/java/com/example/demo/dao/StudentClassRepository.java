package com.example.demo.dao;

import com.example.demo.entity.StudentClass;
import com.example.demo.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;


public interface StudentClassRepository extends JpaRepository<StudentClass, Integer> {
  StudentClass findByTutor(Teacher teacher);
}
