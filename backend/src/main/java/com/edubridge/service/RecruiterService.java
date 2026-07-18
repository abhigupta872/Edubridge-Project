package com.edubridge.service;

import com.edubridge.dto.InternshipDto;
import com.edubridge.dto.JobDto;
import com.edubridge.dto.RecruiterProfileDto;
import com.edubridge.dto.StudentMatchDto;

import java.util.List;

public interface RecruiterService {
    RecruiterProfileDto getRecruiterProfile(Long recruiterId);
    RecruiterProfileDto updateRecruiterProfile(Long recruiterId, RecruiterProfileDto dto);
    
    // Job CRUD
    JobDto postJob(Long recruiterId, JobDto jobDto);
    JobDto updateJob(Long jobId, JobDto jobDto);
    void deleteJob(Long jobId);
    List<JobDto> getJobsByRecruiter(Long recruiterId);
    List<JobDto> getAllJobs();
    JobDto getJobById(Long jobId);

    // Internship CRUD
    InternshipDto postInternship(Long recruiterId, InternshipDto internshipDto);
    InternshipDto updateInternship(Long internshipId, InternshipDto internshipDto);
    void deleteInternship(Long internshipId);
    List<InternshipDto> getInternshipsByRecruiter(Long recruiterId);
    List<InternshipDto> getAllInternships();
    InternshipDto getInternshipById(Long internshipId);

    // Search and match
    List<StudentMatchDto> searchStudentsBySkills(List<String> skillNames);
}
