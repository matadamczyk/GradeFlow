package com.example.demo.dao;

import com.example.demo.entity.TeacherSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface TeacherSubjectRepository extends JpaRepository<TeacherSubject, Integer> {
  @Transactional
  @Modifying
  @Query("DELETE FROM TeacherSubject ts WHERE ts.teacher.id = :teacherId")
  void deleteByTeacherId(@Param("teacherId") Integer teacherId);

}
