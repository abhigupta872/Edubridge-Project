package com.edubridge.controller;

import com.edubridge.config.UserDetailsImpl;
import com.edubridge.dto.QuizDto;
import com.edubridge.dto.QuestionDto;
import com.edubridge.service.QuizService;
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
public class MentorQuizController {

    @Autowired
    private QuizService quizService;

    @PostMapping("/quizzes")
    public ResponseEntity<QuizDto> createQuiz(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody QuizDto quizDto) {
        QuizDto created = quizService.createQuiz(userDetails.getId(), quizDto);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/quizzes")
    public ResponseEntity<List<QuizDto>> getQuizzes(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<QuizDto> list = quizService.getQuizzesByMentor(userDetails.getId());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/quizzes/{id}")
    public ResponseEntity<QuizDto> getQuiz(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id) {
        QuizDto quiz = quizService.getQuizDetailsForMentor(userDetails.getId(), id);
        return ResponseEntity.ok(quiz);
    }

    @PutMapping("/quizzes/{id}")
    public ResponseEntity<QuizDto> updateQuiz(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id,
            @RequestBody QuizDto quizDto) {
        QuizDto updated = quizService.updateQuiz(userDetails.getId(), id, quizDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/quizzes/{id}")
    public ResponseEntity<?> deleteQuiz(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id) {
        quizService.deleteQuiz(userDetails.getId(), id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Quiz deleted successfully!");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/questions")
    public ResponseEntity<QuestionDto> addQuestion(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody QuestionDto questionDto) {
        if (questionDto.getQuizId() == null) {
            throw new IllegalArgumentException("Quiz ID is required to insert a question.");
        }
        QuestionDto created = quizService.addQuestion(userDetails.getId(), questionDto.getQuizId(), questionDto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/questions/{id}")
    public ResponseEntity<QuestionDto> updateQuestion(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id,
            @RequestBody QuestionDto questionDto) {
        QuestionDto updated = quizService.updateQuestion(userDetails.getId(), id, questionDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<?> deleteQuestion(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id) {
        quizService.deleteQuestion(userDetails.getId(), id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Question deleted successfully!");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/quizzes/{id}/analytics")
    public ResponseEntity<Map<String, Object>> getQuizAnalytics(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id) {
        Map<String, Object> analytics = quizService.getMentorQuizAnalytics(userDetails.getId(), id);
        return ResponseEntity.ok(analytics);
    }
}
