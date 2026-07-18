package com.edubridge.controller;

import com.edubridge.config.UserDetailsImpl;
import com.edubridge.dto.*;
import com.edubridge.service.MatchingService;
import com.edubridge.service.MentorService;
import com.edubridge.service.SkillGapService;
import com.edubridge.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/student")
@PreAuthorize("hasRole('STUDENT')")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private MatchingService matchingService;

    @Autowired
    private SkillGapService skillGapService;

    @Autowired
    private MentorService mentorService;

    @GetMapping("/profile")
    public ResponseEntity<StudentProfileDto> getProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        StudentProfileDto profile = studentService.getStudentProfile(userDetails.getId());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<StudentProfileDto> updateProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody StudentProfileDto profileDto) {
        StudentProfileDto updated = studentService.updateStudentProfile(userDetails.getId(), profileDto);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/skills")
    public ResponseEntity<StudentProfileDto> updateSkills(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Set<String> skillNames) {
        StudentProfileDto updated = studentService.updateSkills(userDetails.getId(), skillNames);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/recommendations/jobs")
    public ResponseEntity<List<JobMatchDto>> getJobRecommendations(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<JobMatchDto> recs = matchingService.getRecommendedJobsForStudent(userDetails.getId());
        return ResponseEntity.ok(recs);
    }

    @GetMapping("/gap-report")
    public ResponseEntity<SkillGapReportDto> getSkillGapReport(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam Long positionId,
            @RequestParam boolean isInternship) {
        SkillGapReportDto report = skillGapService.generateSkillGapReport(userDetails.getId(), positionId, isInternship);
        return ResponseEntity.ok(report);
    }

    @PostMapping("/apply/job/{jobId}")
    public ResponseEntity<ApplicationDto> applyJob(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long jobId,
            @RequestParam String resumeUrl) {
        ApplicationDto dto = matchingService.applyForJob(userDetails.getId(), jobId, resumeUrl);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/apply/internship/{internshipId}")
    public ResponseEntity<ApplicationDto> applyInternship(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long internshipId,
            @RequestParam String resumeUrl) {
        ApplicationDto dto = matchingService.applyForInternship(userDetails.getId(), internshipId, resumeUrl);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationDto>> getApplications(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<ApplicationDto> apps = matchingService.getStudentApplications(userDetails.getId());
        return ResponseEntity.ok(apps);
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<MentorSessionDto>> getMentorSessions(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<MentorSessionDto> sessions = mentorService.getSessionsByStudent(userDetails.getId());
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/sessions/available")
    public ResponseEntity<List<MentorSessionDto>> getAvailableSessions() {
        List<MentorSessionDto> available = mentorService.getAvailableSessions();
        return ResponseEntity.ok(available);
    }

    @PostMapping("/sessions/book/{sessionId}")
    public ResponseEntity<MentorSessionDto> bookSession(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long sessionId) {
        MentorSessionDto booked = mentorService.bookSession(sessionId, userDetails.getId());
        return ResponseEntity.ok(booked);
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        StudentProfileDto profile = studentService.getStudentProfile(userDetails.getId());
        List<ApplicationDto> apps = matchingService.getStudentApplications(userDetails.getId());
        List<JobMatchDto> matches = matchingService.getRecommendedJobsForStudent(userDetails.getId());
        List<MentorSessionDto> sessions = mentorService.getSessionsByStudent(userDetails.getId());

        Map<String, Object> stats = new HashMap<>();
        stats.put("skillsCount", profile.getSkills() != null ? profile.getSkills().size() : 0);
        stats.put("appliedCount", apps.size());
        stats.put("recommendedCount", matches.size());
        stats.put("sessionsCount", sessions.size());
        return ResponseEntity.ok(stats);
    }
}
