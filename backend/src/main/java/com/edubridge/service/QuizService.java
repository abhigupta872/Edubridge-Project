package com.edubridge.service;

import com.edubridge.dto.*;
import java.util.List;
import java.util.Map;

public interface QuizService {
    // Mentor Actions
    QuizDto createQuiz(Long mentorUserId, QuizDto quizDto);
    QuizDto updateQuiz(Long mentorUserId, Long quizId, QuizDto quizDto);
    void deleteQuiz(Long mentorUserId, Long quizId);
    QuizDto getQuizDetailsForMentor(Long mentorUserId, Long quizId);
    List<QuizDto> getQuizzesByMentor(Long mentorUserId);
    QuestionDto addQuestion(Long mentorUserId, Long quizId, QuestionDto questionDto);
    QuestionDto updateQuestion(Long mentorUserId, Long questionId, QuestionDto questionDto);
    void deleteQuestion(Long mentorUserId, Long questionId);
    Map<String, Object> getMentorQuizAnalytics(Long mentorUserId, Long quizId);

    // Student Actions
    List<QuizDto> getAvailableQuizzesForStudent(Long studentUserId);
    QuizDto getQuizDetailsForStudent(Long studentUserId, Long quizId);
    QuizAttemptDto submitQuizAttempt(Long studentUserId, Long quizId, QuizSubmissionDto submissionDto);
    List<QuizAttemptDto> getStudentAttemptHistory(Long studentUserId);
    QuizAttemptDto getAttemptDetails(Long studentUserId, Long attemptId);
    Map<String, Object> getStudentPerformanceAnalytics(Long studentUserId);
}
