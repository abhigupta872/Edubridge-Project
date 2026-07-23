package com.edubridge.service;

import com.edubridge.dto.CourseDto;
import com.edubridge.entity.Course;
import com.edubridge.exception.ResourceNotFoundException;
import com.edubridge.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Override
    @Transactional
    public CourseDto addCourse(CourseDto dto) {
        Course course = Course.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .instructor(dto.getInstructor())
                .platform(dto.getPlatform())
                .link(dto.getLink())
                .difficultyLevel(dto.getDifficultyLevel())
                .rating(dto.getRating())
                .tags(dto.getTags())
                .clickCount(0)
                .build();

        Course saved = courseRepository.save(course);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public CourseDto updateCourse(Long courseId, CourseDto dto) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + courseId));

        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        course.setInstructor(dto.getInstructor());
        course.setPlatform(dto.getPlatform());
        course.setLink(dto.getLink());
        course.setDifficultyLevel(dto.getDifficultyLevel());
        course.setRating(dto.getRating());
        course.setTags(dto.getTags());

        Course updated = courseRepository.save(course);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public void deleteCourse(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with ID: " + courseId);
        }
        courseRepository.deleteById(courseId);
    }

    @Override
    public List<CourseDto> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public CourseDto getCourseById(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + courseId));
        return mapToDto(course);
    }

    @Override
    @Transactional
    public void incrementClickCount(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + courseId));
        course.setClickCount(course.getClickCount() == null ? 1 : course.getClickCount() + 1);
        courseRepository.save(course);
    }

    private CourseDto mapToDto(Course c) {
        return CourseDto.builder()
                .id(c.getId())
                .title(c.getTitle())
                .description(c.getDescription())
                .instructor(c.getInstructor())
                .platform(c.getPlatform())
                .link(c.getLink())
                .difficultyLevel(c.getDifficultyLevel())
                .rating(c.getRating())
                .tags(c.getTags())
                .clickCount(c.getClickCount() != null ? c.getClickCount() : 0)
                .build();
    }
}
