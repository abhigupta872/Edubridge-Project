package com.edubridge.service;

import com.edubridge.dto.ApplicationDto;
import com.edubridge.dto.JobMatchDto;
import com.edubridge.entity.*;
import com.edubridge.enums.ApplicationStatus;
import com.edubridge.exception.BadRequestException;
import com.edubridge.exception.ResourceNotFoundException;
import com.edubridge.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MatchingServiceImpl implements MatchingService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private InternshipRepository internshipRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Override
    public List<JobMatchDto> getRecommendedJobsForStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for ID: " + studentId));

        Set<String> studentSkills = student.getSkills().stream()
                .map(Skill::getName)
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        List<JobMatchDto> recommendations = new ArrayList<>();

        // Match against Full-time Jobs
        List<Job> jobs = jobRepository.findAllWithSkills();
        for (Job job : jobs) {
            int score = calculateMatchPercentage(studentSkills, job.getRequiredSkills());
            recommendations.add(mapToJobMatch(job, score));
        }

        // Match against Internships
        List<Internship> internships = internshipRepository.findAllWithSkills();
        for (Internship internship : internships) {
            int score = calculateMatchPercentage(studentSkills, internship.getRequiredSkills());
            recommendations.add(mapToInternshipMatch(internship, score));
        }

        return recommendations.stream()
                .filter(dto -> dto.getMatchPercentage() > 0)
                .sorted((a, b) -> Integer.compare(b.getMatchPercentage(), a.getMatchPercentage()))
                .collect(Collectors.toList());
    }

    private int calculateMatchPercentage(Set<String> studentSkills, Set<Skill> requiredSkills) {
        if (requiredSkills == null || requiredSkills.isEmpty()) {
            return 100; // No requirements means instant match
        }

        Set<String> reqSkillNames = requiredSkills.stream()
                .map(Skill::getName)
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        long matchCount = reqSkillNames.stream()
                .filter(studentSkills::contains)
                .count();

        return (int) (((double) matchCount / reqSkillNames.size()) * 100);
    }

    @Override
    @Transactional
    public ApplicationDto applyForJob(Long studentId, Long jobId, String resumeUrl) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job post not found"));

        if (applicationRepository.existsByStudentIdAndJobId(studentId, jobId)) {
            throw new BadRequestException("You have already applied for this job!");
        }

        Application application = Application.builder()
                .student(student)
                .job(job)
                .resumeUrl(resumeUrl)
                .status(ApplicationStatus.PENDING)
                .build();

        Application saved = applicationRepository.save(application);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public ApplicationDto applyForInternship(Long studentId, Long internshipId, String resumeUrl) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Internship post not found"));

        if (applicationRepository.existsByStudentIdAndInternshipId(studentId, internshipId)) {
            throw new BadRequestException("You have already applied for this internship!");
        }

        Application application = Application.builder()
                .student(student)
                .internship(internship)
                .resumeUrl(resumeUrl)
                .status(ApplicationStatus.PENDING)
                .build();

        Application saved = applicationRepository.save(application);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public ApplicationDto updateApplicationStatus(Long applicationId, String status, String feedback) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        try {
            ApplicationStatus appStatus = ApplicationStatus.valueOf(status.toUpperCase());
            application.setStatus(appStatus);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid application status: " + status);
        }

        application.setFeedback(feedback);
        Application saved = applicationRepository.save(application);
        return mapToDto(saved);
    }

    @Override
    public List<ApplicationDto> getStudentApplications(Long studentId) {
        return applicationRepository.findByStudentId(studentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ApplicationDto> getRecruiterApplications(Long recruiterId) {
        return applicationRepository.findByRecruiterId(recruiterId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private JobMatchDto mapToJobMatch(Job j, int score) {
        Set<String> skills = j.getRequiredSkills().stream()
                .map(Skill::getName)
                .collect(Collectors.toSet());

        return JobMatchDto.builder()
                .jobId(j.getId())
                .title(j.getTitle())
                .companyName(j.getCompanyName())
                .location(j.getLocation())
                .requiredSkills(skills)
                .matchPercentage(score)
                .internship(false)
                .build();
    }

    private JobMatchDto mapToInternshipMatch(Internship i, int score) {
        Set<String> skills = i.getRequiredSkills().stream()
                .map(Skill::getName)
                .collect(Collectors.toSet());

        return JobMatchDto.builder()
                .internshipId(i.getId())
                .title(i.getTitle())
                .companyName(i.getCompanyName())
                .location(i.getLocation())
                .requiredSkills(skills)
                .matchPercentage(score)
                .internship(true)
                .build();
    }

    private ApplicationDto mapToDto(Application a) {
        String jobTitle = a.getJob() != null ? a.getJob().getTitle() : null;
        String internshipTitle = a.getInternship() != null ? a.getInternship().getTitle() : null;
        String companyName = a.getJob() != null ? a.getJob().getCompanyName() : (a.getInternship() != null ? a.getInternship().getCompanyName() : null);

        return ApplicationDto.builder()
                .id(a.getId())
                .studentId(a.getStudent().getId())
                .studentName(a.getStudent().getFirstName() + " " + a.getStudent().getLastName())
                .jobId(a.getJob() != null ? a.getJob().getId() : null)
                .jobTitle(jobTitle)
                .internshipId(a.getInternship() != null ? a.getInternship().getId() : null)
                .internshipTitle(internshipTitle)
                .companyName(companyName)
                .status(a.getStatus().name())
                .resumeUrl(a.getResumeUrl())
                .appliedDate(a.getAppliedDate())
                .feedback(a.getFeedback())
                .build();
    }
}
