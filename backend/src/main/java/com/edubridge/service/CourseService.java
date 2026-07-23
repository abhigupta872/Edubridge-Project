package com.edubridge.service;

import com.edubridge.dto.CourseDto;

import java.util.List;

public interface CourseService {
    CourseDto addCourse(CourseDto courseDto);
    CourseDto updateCourse(Long courseId, CourseDto courseDto);
    void deleteCourse(Long courseId);
    List<CourseDto> getAllCourses();
    CourseDto getCourseById(Long courseId);
    void incrementClickCount(Long courseId);
}
