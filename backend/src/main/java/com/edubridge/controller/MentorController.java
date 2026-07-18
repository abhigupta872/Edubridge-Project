package com.edubridge.controller;

import com.edubridge.config.UserDetailsImpl;
import com.edubridge.dto.MentorProfileDto;
import com.edubridge.dto.MentorSessionDto;
import com.edubridge.service.MentorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/mentor")
@PreAuthorize("hasRole('MENTOR')")
public class MentorController {

    @Autowired
    private MentorService mentorService;

    @GetMapping("/profile")
    public ResponseEntity<MentorProfileDto> getProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        MentorProfileDto profile = mentorService.getMentorProfile(userDetails.getId());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<MentorProfileDto> updateProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody MentorProfileDto profileDto) {
        MentorProfileDto updated = mentorService.updateMentorProfile(userDetails.getId(), profileDto);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/sessions")
    public ResponseEntity<MentorSessionDto> scheduleSession(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody MentorSessionDto sessionDto) {
        MentorSessionDto scheduled = mentorService.scheduleSession(userDetails.getId(), sessionDto);
        return ResponseEntity.ok(scheduled);
    }

    @PostMapping("/sessions/complete/{sessionId}")
    public ResponseEntity<MentorSessionDto> completeSession(
            @PathVariable Long sessionId,
            @RequestParam String feedback) {
        MentorSessionDto completed = mentorService.completeSession(sessionId, feedback);
        return ResponseEntity.ok(completed);
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<MentorSessionDto>> getSessions(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<MentorSessionDto> sessions = mentorService.getSessionsByMentor(userDetails.getId());
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<MentorSessionDto> sessions = mentorService.getSessionsByMentor(userDetails.getId());
        
        long totalSessions = sessions.size();
        long completedSessions = sessions.stream()
                .filter(s -> "COMPLETED".equalsIgnoreCase(s.getStatus()))
                .count();
        long activeSessions = totalSessions - completedSessions;
        long uniqueStudents = sessions.stream()
                .filter(s -> s.getStudentId() != null)
                .map(MentorSessionDto::getStudentId)
                .distinct()
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSessions", totalSessions);
        stats.put("completedSessions", completedSessions);
        stats.put("activeSessions", activeSessions);
        stats.put("uniqueStudents", uniqueStudents);
        return ResponseEntity.ok(stats);
    }
}
