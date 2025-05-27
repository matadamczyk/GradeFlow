package com.example.demo.service;

import com.example.demo.dao.TimetableRepository;
import com.example.demo.entity.Timetable;
import com.example.demo.entity.WorkDay;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TimetableService {

  private final TimetableRepository timetableRepository;

  public TimetableService(TimetableRepository timetableRepository) {
    this.timetableRepository = timetableRepository;
  }

  public List<Timetable> getTimetableForClassAndDay(Integer classId, WorkDay day) {
    return timetableRepository.findByStudentClassIdAndDay(classId, day);
  }

  public Timetable addLesson(Timetable lesson) {
    return timetableRepository.save(lesson);
  }

  public Timetable updateLesson(Timetable lesson) {
    return timetableRepository.save(lesson);
  }

  public void deleteLesson(Integer lessonId) {
    timetableRepository.deleteById(lessonId);
  }

  public Timetable getLessonById(Integer lessonId) {
    return timetableRepository.findById(lessonId).orElse(null);
  }
}
