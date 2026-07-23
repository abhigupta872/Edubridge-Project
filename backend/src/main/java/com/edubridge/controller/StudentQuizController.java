package com.edubridge.controller;

import com.edubridge.config.UserDetailsImpl;
import com.edubridge.dto.QuizAttemptDto;
import com.edubridge.dto.QuizDto;
import com.edubridge.dto.QuizSubmissionDto;
import com.edubridge.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/student")
@PreAuthorize("hasRole('STUDENT')")
public class StudentQuizController {

    @Autowired
    private QuizService quizService;

    @GetMapping("/quizzes")
    public ResponseEntity<List<QuizDto>> getAvailableQuizzes(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<QuizDto> list = quizService.getAvailableQuizzesForStudent(userDetails.getId());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/quizzes/{id}")
    public ResponseEntity<QuizDto> getQuizDetails(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id) {
        QuizDto quiz = quizService.getQuizDetailsForStudent(userDetails.getId(), id);
        return ResponseEntity.ok(quiz);
    }

    @PostMapping("/quizzes/{id}/submit")
    public ResponseEntity<QuizAttemptDto> submitQuiz(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id,
            @RequestBody QuizSubmissionDto submissionDto) {
        QuizAttemptDto attempt = quizService.submitQuizAttempt(userDetails.getId(), id, submissionDto);
        return ResponseEntity.ok(attempt);
    }

    @GetMapping("/results")
    public ResponseEntity<List<QuizAttemptDto>> getAttemptHistory(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<QuizAttemptDto> list = quizService.getStudentAttemptHistory(userDetails.getId());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/results/{attemptId}")
    public ResponseEntity<QuizAttemptDto> getAttemptDetails(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long attemptId) {
        QuizAttemptDto details = quizService.getAttemptDetails(userDetails.getId(), attemptId);
        return ResponseEntity.ok(details);
    }

    @GetMapping("/performance-analytics")
    public ResponseEntity<Map<String, Object>> getPerformanceAnalytics(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        Map<String, Object> analytics = quizService.getStudentPerformanceAnalytics(userDetails.getId());
        return ResponseEntity.ok(analytics);
    }
}
