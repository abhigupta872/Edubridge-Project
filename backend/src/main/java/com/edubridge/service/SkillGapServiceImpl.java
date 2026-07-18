package com.edubridge.service;

import com.edubridge.dto.CourseDto;
import com.edubridge.dto.SkillGapReportDto;
import com.edubridge.entity.*;
import com.edubridge.exception.ResourceNotFoundException;
import com.edubridge.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SkillGapServiceImpl implements SkillGapService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private InternshipRepository internshipRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Override
    public SkillGapReportDto generateSkillGapReport(Long studentId, Long positionId, boolean isInternship) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for ID: " + studentId));

        Set<String> studentSkills = student.getSkills().stream()
                .map(Skill::getName)
                .collect(Collectors.toSet());

        Set<String> requiredSkills = new HashSet<>();
        String title = "";
        String companyName = "";

        if (isInternship) {
            Internship internship = internshipRepository.findById(positionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Internship not found for ID: " + positionId));
            requiredSkills = internship.getRequiredSkills().stream()
                    .map(Skill::getName)
                    .collect(Collectors.toSet());
            title = internship.getTitle();
            companyName = internship.getCompanyName();
        } else {
            Job job = jobRepository.findById(positionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Job not found for ID: " + positionId));
            requiredSkills = job.getRequiredSkills().stream()
                    .map(Skill::getName)
                    .collect(Collectors.toSet());
            title = job.getTitle();
            companyName = job.getCompanyName();
        }

        // Matching and Missing skills calculation
        List<String> matching = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String req : requiredSkills) {
            boolean matched = studentSkills.stream()
                    .anyMatch(s -> s.equalsIgnoreCase(req));
            if (matched) {
                matching.add(req);
            } else {
                missing.add(req);
            }
        }

        // Recommend courses for missing skills
        Set<Course> recommendedCourseEntities = new HashSet<>();
        for (String miss : missing) {
            List<Course> courses = courseRepository.findByTag(miss);
            recommendedCourseEntities.addAll(courses);
        }

        List<CourseDto> courseDtos = recommendedCourseEntities.stream()
                .map(this::mapToCourseDto)
                .collect(Collectors.toList());

        return SkillGapReportDto.builder()
                .studentId(studentId)
                .jobId(!isInternship ? positionId : null)
                .internshipId(isInternship ? positionId : null)
                .title(title)
                .companyName(companyName)
                .matchingSkills(matching)
                .missingSkills(missing)
                .recommendedCourses(courseDtos)
                .build();
    }

    private CourseDto mapToCourseDto(Course c) {
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
                .build();
    }
}
