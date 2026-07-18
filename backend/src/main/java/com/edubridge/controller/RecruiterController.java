package com.edubridge.controller;

import com.edubridge.config.UserDetailsImpl;
import com.edubridge.dto.*;
import com.edubridge.service.MatchingService;
import com.edubridge.service.RecruiterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/recruiter")
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterController {

    @Autowired
    private RecruiterService recruiterService;

    @Autowired
    private MatchingService matchingService;

    @GetMapping("/profile")
    public ResponseEntity<RecruiterProfileDto> getProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        RecruiterProfileDto profile = recruiterService.getRecruiterProfile(userDetails.getId());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<RecruiterProfileDto> updateProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody RecruiterProfileDto profileDto) {
        RecruiterProfileDto updated = recruiterService.updateRecruiterProfile(userDetails.getId(), profileDto);
        return ResponseEntity.ok(updated);
    }

    // JOB VA CANCIES ENDPOINTS
    @PostMapping("/jobs")
    public ResponseEntity<JobDto> postJob(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody JobDto jobDto) {
        JobDto created = recruiterService.postJob(userDetails.getId(), jobDto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/jobs/{jobId}")
    public ResponseEntity<JobDto> updateJob(@PathVariable Long jobId, @RequestBody JobDto jobDto) {
        JobDto updated = recruiterService.updateJob(jobId, jobDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/jobs/{jobId}")
    public ResponseEntity<?> deleteJob(@PathVariable Long jobId) {
        recruiterService.deleteJob(jobId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Job vacancy deleted successfully!");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobDto>> getMyJobs(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<JobDto> jobs = recruiterService.getJobsByRecruiter(userDetails.getId());
        return ResponseEntity.ok(jobs);
    }

    // INTERNSHIP OPPORTUNITIES ENDPOINTS
    @PostMapping("/internships")
    public ResponseEntity<InternshipDto> postInternship(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody InternshipDto dto) {
        InternshipDto created = recruiterService.postInternship(userDetails.getId(), dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/internships/{internshipId}")
    public ResponseEntity<InternshipDto> updateInternship(@PathVariable Long internshipId, @RequestBody InternshipDto dto) {
        InternshipDto updated = recruiterService.updateInternship(internshipId, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/internships/{internshipId}")
    public ResponseEntity<?> deleteInternship(@PathVariable Long internshipId) {
        recruiterService.deleteInternship(internshipId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Internship opportunity deleted successfully!");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/internships")
    public ResponseEntity<List<InternshipDto>> getMyInternships(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<InternshipDto> internships = recruiterService.getInternshipsByRecruiter(userDetails.getId());
        return ResponseEntity.ok(internships);
    }

    // CANDIDATE APPLICATIONS AND EVALUATION
    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationDto>> getApplicationsReceived(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<ApplicationDto> apps = matchingService.getRecruiterApplications(userDetails.getId());
        return ResponseEntity.ok(apps);
    }

    @PostMapping("/applications/evaluate/{applicationId}")
    public ResponseEntity<ApplicationDto> evaluateApplication(
            @PathVariable Long applicationId,
            @RequestParam String status,
            @RequestParam String feedback) {
        ApplicationDto dto = matchingService.updateApplicationStatus(applicationId, status, feedback);
        return ResponseEntity.ok(dto);
    }

    // SKILL-BASED CANDIDATE SEARCH
    @GetMapping("/students/search")
    public ResponseEntity<List<StudentMatchDto>> searchStudents(@RequestParam(required = false) String skills) {
        List<String> list = (skills == null || skills.trim().isEmpty())
                ? List.of()
                : Arrays.asList(skills.split(","));
        List<StudentMatchDto> matches = recruiterService.searchStudentsBySkills(list);
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<JobDto> jobs = recruiterService.getJobsByRecruiter(userDetails.getId());
        List<InternshipDto> internships = recruiterService.getInternshipsByRecruiter(userDetails.getId());
        List<ApplicationDto> apps = matchingService.getRecruiterApplications(userDetails.getId());

        long totalApplications = apps.size();
        long shortlistedCount = apps.stream()
                .filter(a -> "SHORTLISTED".equalsIgnoreCase(a.getStatus()))
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("jobsPosted", jobs.size());
        stats.put("internshipsPosted", internships.size());
        stats.put("applicationsReceived", totalApplications);
        stats.put("shortlistedCandidates", shortlistedCount);
        return ResponseEntity.ok(stats);
    }
}
