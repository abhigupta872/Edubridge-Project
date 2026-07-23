package com.edubridge.controller;

import com.edubridge.enums.UserRole;
import com.edubridge.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private MentorService mentorService;

    @Autowired
    private RecruiterService recruiterService;

    @Autowired
    private CourseService courseService;

    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats() {
        long studentCount = userService.countUsersByRole(UserRole.STUDENT);
        long mentorCount = userService.countUsersByRole(UserRole.MENTOR);
        long recruiterCount = userService.countUsersByRole(UserRole.RECRUITER);
        long courseCount = courseService.getAllCourses().size();
        long jobCount = recruiterService.getAllJobs().size();
        long internshipCount = recruiterService.getAllInternships().size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("studentsCount", studentCount);
        stats.put("mentorsCount", mentorCount);
        stats.put("recruitersCount", recruiterCount);
        stats.put("coursesCount", courseCount);
        stats.put("jobsCount", jobCount);
        stats.put("internshipsCount", internshipCount);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<Map<String, Object>> users = userService.getAllUsers().stream()
                .map(user -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", user.getId());
                    map.put("email", user.getEmail());
                    map.put("role", user.getRole().name());
                    map.put("active", user.isActive());
                    map.put("createdAt", user.getCreatedAt());
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User and all related profile data deleted successfully!");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/jobs/{jobId}")
    public ResponseEntity<?> deleteJob(@PathVariable Long jobId) {
        recruiterService.deleteJob(jobId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Job deleted successfully!");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/internships/{internshipId}")
    public ResponseEntity<?> deleteInternship(@PathVariable Long internshipId) {
        recruiterService.deleteInternship(internshipId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Internship deleted successfully!");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/jobs/{jobId}/status")
    public ResponseEntity<?> updateJobStatus(@PathVariable Long jobId, @RequestParam String status) {
        com.edubridge.dto.JobDto jobDto = recruiterService.getJobById(jobId);
        jobDto.setStatus(status);
        com.edubridge.dto.JobDto updated = recruiterService.updateJob(jobId, jobDto);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/internships/{internshipId}/status")
    public ResponseEntity<?> updateInternshipStatus(@PathVariable Long internshipId, @RequestParam String status) {
        com.edubridge.dto.InternshipDto internshipDto = recruiterService.getInternshipById(internshipId);
        internshipDto.setStatus(status);
        com.edubridge.dto.InternshipDto updated = recruiterService.updateInternship(internshipId, internshipDto);
        return ResponseEntity.ok(updated);
    }
}
