package com.example.demo.dao;

import com.example.demo.entity.Student;
import com.example.demo.entity.StudentClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Integer> {
  List<Student> findByStudentClass(StudentClass studentClass);
  Optional<Student> findByUserId(Integer userId);
}
