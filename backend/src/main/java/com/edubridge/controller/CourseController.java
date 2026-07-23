package com.edubridge.controller;

import com.edubridge.dto.CourseDto;
import com.edubridge.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    // Public course list (matching the permitAll request matcher in SecurityConfig)
    @GetMapping("/list")
    public ResponseEntity<List<CourseDto>> getPublicCourses() {
        List<CourseDto> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'RECRUITER', 'ADMIN')")
    public ResponseEntity<List<CourseDto>> getAllCourses() {
        List<CourseDto> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'RECRUITER', 'ADMIN')")
    public ResponseEntity<CourseDto> getCourseById(@PathVariable Long id) {
        CourseDto course = courseService.getCourseById(id);
        return ResponseEntity.ok(course);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseDto> addCourse(@Valid @RequestBody CourseDto courseDto) {
        CourseDto created = courseService.addCourse(courseDto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseDto> updateCourse(@PathVariable Long id, @Valid @RequestBody CourseDto courseDto) {
        CourseDto updated = courseService.updateCourse(id, courseDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Course deleted successfully!");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/click")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'RECRUITER', 'ADMIN')")
    public ResponseEntity<?> recordClick(@PathVariable Long id) {
        courseService.incrementClickCount(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Analytics click successfully recorded.");
        return ResponseEntity.ok(response);
    }
}
