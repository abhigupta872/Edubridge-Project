package com.edubridge.controller;

import com.edubridge.dto.InternshipDto;
import com.edubridge.dto.JobDto;
import com.edubridge.service.RecruiterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("")
public class JobController {

    @Autowired
    private RecruiterService recruiterService;

    @GetMapping("/jobs")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'RECRUITER', 'ADMIN')")
    public ResponseEntity<List<JobDto>> getAllJobs() {
        List<JobDto> jobs = recruiterService.getAllJobs();
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/jobs/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'RECRUITER', 'ADMIN')")
    public ResponseEntity<JobDto> getJobById(@PathVariable Long id) {
        JobDto job = recruiterService.getJobById(id);
        return ResponseEntity.ok(job);
    }

    @GetMapping("/internships")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'RECRUITER', 'ADMIN')")
    public ResponseEntity<List<InternshipDto>> getAllInternships() {
        List<InternshipDto> internships = recruiterService.getAllInternships();
        return ResponseEntity.ok(internships);
    }

    @GetMapping("/internships/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'MENTOR', 'RECRUITER', 'ADMIN')")
    public ResponseEntity<InternshipDto> getInternshipById(@PathVariable Long id) {
        InternshipDto internship = recruiterService.getInternshipById(id);
        return ResponseEntity.ok(internship);
    }
}
