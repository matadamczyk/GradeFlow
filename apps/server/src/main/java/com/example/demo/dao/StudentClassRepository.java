package com.example.demo.dao;

import com.example.demo.entity.StudentClass;
import org.springframework.data.jpa.repository.JpaRepository;


public interface StudentClassRepository extends JpaRepository<StudentClass, Integer> {}
