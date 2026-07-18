package com.edubridge.service;

import com.edubridge.dto.ApplicationDto;
import com.edubridge.dto.JobMatchDto;

import java.util.List;

public interface MatchingService {
    // Recommendation algorithm
    List<JobMatchDto> getRecommendedJobsForStudent(Long studentId);
    
    // Application management
    ApplicationDto applyForJob(Long studentId, Long jobId, String resumeUrl);
    ApplicationDto applyForInternship(Long studentId, Long internshipId, String resumeUrl);
    ApplicationDto updateApplicationStatus(Long applicationId, String status, String feedback);
    List<ApplicationDto> getStudentApplications(Long studentId);
    List<ApplicationDto> getRecruiterApplications(Long recruiterId);
}
