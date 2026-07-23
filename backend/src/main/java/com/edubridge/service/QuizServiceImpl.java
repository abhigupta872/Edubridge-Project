package com.edubridge.service;

import com.edubridge.dto.*;
import com.edubridge.entity.*;
import com.edubridge.exception.ResourceNotFoundException;
import com.edubridge.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class QuizServiceImpl implements QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuestionOptionRepository optionRepository;

    @Autowired
    private QuizAttemptRepository attemptRepository;

    @Autowired
    private StudentAnswerRepository studentAnswerRepository;

    @Autowired
    private MentorRepository mentorRepository;

    @Autowired
    private StudentRepository studentRepository;

    // Mentor CRUD Actions

    @Override
    public QuizDto createQuiz(Long mentorUserId, QuizDto quizDto) {
        Mentor mentor = mentorRepository.findById(mentorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found with ID: " + mentorUserId));

        Quiz quiz = Quiz.builder()
                .mentor(mentor)
                .title(quizDto.getTitle())
                .description(quizDto.getDescription())
                .category(quizDto.getCategory())
                .difficulty(quizDto.getDifficulty())
                .timeLimit(quizDto.getTimeLimit() != null ? quizDto.getTimeLimit() : 15)
                .totalMarks(quizDto.getTotalMarks() != null ? quizDto.getTotalMarks() : 100)
                .passingPercentage(quizDto.getPassingPercentage() != null ? quizDto.getPassingPercentage() : 50)
                .status(quizDto.getStatus() != null ? quizDto.getStatus() : "DRAFT")
                .createdAt(LocalDateTime.now())
                .build();

        Quiz saved = quizRepository.save(quiz);

        if (quizDto.getQuestions() != null) {
            for (QuestionDto qDto : quizDto.getQuestions()) {
                addQuestionToQuiz(saved, qDto);
            }
        }

        return mapToQuizDto(saved, true);
    }

    @Override
    public QuizDto updateQuiz(Long mentorUserId, Long quizId, QuizDto quizDto) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with ID: " + quizId));

        if (!quiz.getMentor().getId().equals(mentorUserId)) {
            throw new IllegalArgumentException("Unauthorized: You do not own this quiz assessment.");
        }

        quiz.setTitle(quizDto.getTitle());
        quiz.setDescription(quizDto.getDescription());
        quiz.setCategory(quizDto.getCategory());
        quiz.setDifficulty(quizDto.getDifficulty());
        quiz.setTimeLimit(quizDto.getTimeLimit());
        quiz.setTotalMarks(quizDto.getTotalMarks());
        quiz.setPassingPercentage(quizDto.getPassingPercentage());
        if (quizDto.getStatus() != null) {
            quiz.setStatus(quizDto.getStatus());
        }

        Quiz updated = quizRepository.save(quiz);
        return mapToQuizDto(updated, true);
    }

    @Override
    public void deleteQuiz(Long mentorUserId, Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with ID: " + quizId));

        if (!quiz.getMentor().getId().equals(mentorUserId)) {
            throw new IllegalArgumentException("Unauthorized: You do not own this quiz assessment.");
        }

        quizRepository.delete(quiz);
    }

    @Override
    public QuizDto getQuizDetailsForMentor(Long mentorUserId, Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with ID: " + quizId));
        if (!quiz.getMentor().getId().equals(mentorUserId)) {
            throw new IllegalArgumentException("Unauthorized access to this quiz configuration.");
        }
        return mapToQuizDto(quiz, true);
    }

    @Override
    public List<QuizDto> getQuizzesByMentor(Long mentorUserId) {
        return quizRepository.findByMentorId(mentorUserId).stream()
                .map(q -> mapToQuizDto(q, false))
                .collect(Collectors.toList());
    }

    @Override
    public QuestionDto addQuestion(Long mentorUserId, Long quizId, QuestionDto questionDto) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with ID: " + quizId));

        if (!quiz.getMentor().getId().equals(mentorUserId)) {
            throw new IllegalArgumentException("Unauthorized: You do not own this quiz assessment.");
        }

        Question question = addQuestionToQuiz(quiz, questionDto);
        return mapToQuestionDto(question, true);
    }

    private Question addQuestionToQuiz(Quiz quiz, QuestionDto questionDto) {
        Question question = Question.builder()
                .quiz(quiz)
                .questionText(questionDto.getQuestionText())
                .explanation(questionDto.getExplanation())
                .marks(questionDto.getMarks() != null ? questionDto.getMarks() : 1)
                .build();

        Question savedQuestion = questionRepository.save(question);

        if (questionDto.getOptions() != null) {
            List<QuestionOption> options = questionDto.getOptions().stream().map(oDto -> 
                QuestionOption.builder()
                        .question(savedQuestion)
                        .optionText(oDto.getOptionText())
                        .isCorrect(oDto.getIsCorrect() != null ? oDto.getIsCorrect() : false)
                        .build()
            ).collect(Collectors.toList());

            optionRepository.saveAll(options);
            savedQuestion.setOptions(options);
        }

        return savedQuestion;
    }

    @Override
    public QuestionDto updateQuestion(Long mentorUserId, Long questionId, QuestionDto questionDto) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with ID: " + questionId));

        if (!question.getQuiz().getMentor().getId().equals(mentorUserId)) {
            throw new IllegalArgumentException("Unauthorized to modify this question.");
        }

        question.setQuestionText(questionDto.getQuestionText());
        question.setExplanation(questionDto.getExplanation());
        question.setMarks(questionDto.getMarks());

        // Update options
        optionRepository.deleteAll(question.getOptions());
        question.getOptions().clear();

        if (questionDto.getOptions() != null) {
            List<QuestionOption> newOptions = questionDto.getOptions().stream().map(oDto -> 
                QuestionOption.builder()
                        .question(question)
                        .optionText(oDto.getOptionText())
                        .isCorrect(oDto.getIsCorrect() != null ? oDto.getIsCorrect() : false)
                        .build()
            ).collect(Collectors.toList());
            optionRepository.saveAll(newOptions);
            question.setOptions(newOptions);
        }

        Question saved = questionRepository.save(question);
        return mapToQuestionDto(saved, true);
    }

    @Override
    public void deleteQuestion(Long mentorUserId, Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with ID: " + questionId));

        if (!question.getQuiz().getMentor().getId().equals(mentorUserId)) {
            throw new IllegalArgumentException("Unauthorized to delete this question.");
        }

        questionRepository.delete(question);
    }

    @Override
    public Map<String, Object> getMentorQuizAnalytics(Long mentorUserId, Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with ID: " + quizId));

        if (!quiz.getMentor().getId().equals(mentorUserId)) {
            throw new IllegalArgumentException("Unauthorized access to quiz analytics.");
        }

        List<QuizAttempt> attempts = attemptRepository.findByQuizId(quizId);

        Map<String, Object> stats = new HashMap<>();
        stats.put("quizTitle", quiz.getTitle());
        stats.put("attemptsCount", attempts.size());

        if (attempts.isEmpty()) {
            stats.put("averageScore", 0.0);
            stats.put("highestScore", 0.0);
            stats.put("lowestScore", 0.0);
            stats.put("difficultQuestionText", "No attempts logged yet");
            stats.put("individualScores", Collections.emptyList());
            return stats;
        }

        double avg = attempts.stream().mapToDouble(QuizAttempt::getPercentage).average().orElse(0.0);
        double max = attempts.stream().mapToDouble(QuizAttempt::getPercentage).max().orElse(0.0);
        double min = attempts.stream().mapToDouble(QuizAttempt::getPercentage).min().orElse(0.0);

        stats.put("averageScore", Math.round(avg * 100.0) / 100.0);
        stats.put("highestScore", Math.round(max * 100.0) / 100.0);
        stats.put("lowestScore", Math.round(min * 100.0) / 100.0);

        // Find most difficult question
        List<Question> questions = questionRepository.findByQuizId(quizId);
        Question difficultQuestion = null;
        long maxWrongAttempts = -1;

        for (Question q : questions) {
            long wrongCount = attempts.stream()
                .flatMap(att -> att.getStudentAnswers().stream())
                .filter(ans -> ans.getQuestion().getId().equals(q.getId()) && !ans.getIsCorrect())
                .count();

            if (wrongCount > maxWrongAttempts) {
                maxWrongAttempts = wrongCount;
                difficultQuestion = q;
            }
        }

        stats.put("difficultQuestionText", difficultQuestion != null ? difficultQuestion.getQuestionText() : "N/A");

        // List individual scores
        List<Map<String, Object>> individualLogs = attempts.stream().map(a -> {
            Map<String, Object> log = new HashMap<>();
            log.put("studentName", a.getStudent().getFirstName() + " " + a.getStudent().getLastName());
            log.put("email", a.getStudent().getUser().getEmail());
            log.put("score", a.getScore());
            log.put("percentage", Math.round(a.getPercentage() * 100.0) / 100.0);
            log.put("status", a.getResultStatus());
            log.put("date", a.getCompletedTime());
            return log;
        }).collect(Collectors.toList());

        stats.put("individualScores", individualLogs);

        return stats;
    }

    // Student Actions

    @Override
    public List<QuizDto> getAvailableQuizzesForStudent(Long studentUserId) {
        // Return only PUBLISHED quizzes
        return quizRepository.findByStatus("PUBLISHED").stream()
                .map(q -> mapToQuizDto(q, false))
                .collect(Collectors.toList());
    }

    @Override
    public QuizDto getQuizDetailsForStudent(Long studentUserId, Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with ID: " + quizId));

        if (!"PUBLISHED".equals(quiz.getStatus())) {
            throw new IllegalArgumentException("This quiz is currently in DRAFT mode.");
        }

        // Map quiz details but explicitly omit explanation and correct option flags for student security!
        QuizDto dto = mapToQuizDto(quiz, true);
        if (dto.getQuestions() != null) {
            for (QuestionDto q : dto.getQuestions()) {
                q.setExplanation(null); // Omit explanation
                if (q.getOptions() != null) {
                    for (OptionDto o : q.getOptions()) {
                        o.setIsCorrect(null); // Hide correct answer flags!
                    }
                }
            }
        }
        return dto;
    }

    @Override
    public QuizAttemptDto submitQuizAttempt(Long studentUserId, Long quizId, QuizSubmissionDto submissionDto) {
        Student student = studentRepository.findById(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found with ID: " + studentUserId));

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with ID: " + quizId));

        List<Question> questions = questionRepository.findByQuizId(quizId);
        int totalQuestions = questions.size();
        int correctCount = 0;
        int totalScoredMarks = 0;
        int maxMarks = 0;

        List<StudentAnswer> answersToSave = new ArrayList<>();

        QuizAttempt attempt = QuizAttempt.builder()
                .student(student)
                .quiz(quiz)
                .startedTime(LocalDateTime.now().minusMinutes(5)) // Mock started time
                .completedTime(LocalDateTime.now())
                .build();

        QuizAttempt savedAttempt = attemptRepository.save(attempt);

        for (Question q : questions) {
            maxMarks += (q.getMarks() != null ? q.getMarks() : 1);
            Long selectedOptId = submissionDto.getAnswers() != null ? submissionDto.getAnswers().get(q.getId()) : null;

            QuestionOption correctOpt = q.getOptions().stream()
                    .filter(QuestionOption::getIsCorrect)
                    .findFirst()
                    .orElse(null);

            boolean isCorrect = false;
            if (selectedOptId != null && correctOpt != null && correctOpt.getId().equals(selectedOptId)) {
                isCorrect = true;
                correctCount++;
                totalScoredMarks += (q.getMarks() != null ? q.getMarks() : 1);
            }

            StudentAnswer sAns = StudentAnswer.builder()
                    .attempt(savedAttempt)
                    .question(q)
                    .selectedOptionId(selectedOptId)
                    .correctOptionId(correctOpt != null ? correctOpt.getId() : null)
                    .isCorrect(isCorrect)
                    .build();

            answersToSave.add(sAns);
        }

        studentAnswerRepository.saveAll(answersToSave);
        savedAttempt.setStudentAnswers(answersToSave);

        double percentage = maxMarks > 0 ? ((double) totalScoredMarks / maxMarks) * 100.0 : 0.0;
        String status = percentage >= quiz.getPassingPercentage() ? "PASSED" : "FAILED";

        savedAttempt.setScore(totalScoredMarks);
        savedAttempt.setPercentage(percentage);
        savedAttempt.setResultStatus(status);

        QuizAttempt finalAttempt = attemptRepository.save(savedAttempt);
        return mapToQuizAttemptDto(finalAttempt);
    }

    @Override
    public List<QuizAttemptDto> getStudentAttemptHistory(Long studentUserId) {
        return attemptRepository.findByStudentId(studentUserId).stream()
                .map(this::mapToQuizAttemptDto)
                .collect(Collectors.toList());
    }

    @Override
    public QuizAttemptDto getAttemptDetails(Long studentUserId, Long attemptId) {
        QuizAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz Attempt not found with ID: " + attemptId));

        if (!attempt.getStudent().getId().equals(studentUserId) && 
            !attempt.getQuiz().getMentor().getId().equals(studentUserId)) {
            throw new IllegalArgumentException("Unauthorized to view attempt details.");
        }

        return mapToQuizAttemptDto(attempt);
    }

    @Override
    public Map<String, Object> getStudentPerformanceAnalytics(Long studentUserId) {
        List<QuizAttempt> attempts = attemptRepository.findByStudentId(studentUserId);

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalAttempts", attempts.size());

        if (attempts.isEmpty()) {
            analytics.put("averageScore", 0.0);
            analytics.put("skillWisePerformance", Collections.emptyList());
            analytics.put("improvementMsg", "Log attempts to track visual skill growth.");
            return analytics;
        }

        double avg = attempts.stream().mapToDouble(QuizAttempt::getPercentage).average().orElse(0.0);
        analytics.put("averageScore", Math.round(avg * 100.0) / 100.0);

        // Group by category
        Map<String, List<QuizAttempt>> grouped = attempts.stream()
                .collect(Collectors.groupingBy(a -> a.getQuiz().getCategory()));

        List<Map<String, Object>> skillPerformance = new ArrayList<>();
        for (Map.Entry<String, List<QuizAttempt>> entry : grouped.entrySet()) {
            double skillAvg = entry.getValue().stream().mapToDouble(QuizAttempt::getPercentage).average().orElse(0.0);
            
            // Calculate progress (last score vs first score in this category)
            double firstScore = entry.getValue().get(0).getPercentage();
            double lastScore = entry.getValue().get(entry.getValue().size() - 1).getPercentage();
            double diff = lastScore - firstScore;
            String improvementStr = String.format("%s%.1f%%", diff >= 0 ? "+" : "", diff);

            Map<String, Object> skillData = new HashMap<>();
            skillData.put("skill", entry.getKey());
            skillData.put("average", Math.round(skillAvg * 100.0) / 100.0);
            skillData.put("progress", improvementStr);
            skillPerformance.add(skillData);
        }

        analytics.put("skillWisePerformance", skillPerformance);
        analytics.put("improvementMsg", attempts.size() > 1 ? "Steady progress observed across modules." : "Keep taking tests to track progress.");

        return analytics;
    }

    // Mapping Helpers

    private QuizDto mapToQuizDto(Quiz quiz, boolean includeQuestions) {
        String mentorName = quiz.getMentor() != null ? 
                (quiz.getMentor().getFirstName() + " " + quiz.getMentor().getLastName()) : "Unknown";

        QuizDto.QuizDtoBuilder builder = QuizDto.builder()
                .id(quiz.getId())
                .mentorId(quiz.getMentor() != null ? quiz.getMentor().getId() : null)
                .mentorName(mentorName)
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .category(quiz.getCategory())
                .difficulty(quiz.getDifficulty())
                .timeLimit(quiz.getTimeLimit())
                .totalMarks(quiz.getTotalMarks())
                .passingPercentage(quiz.getPassingPercentage())
                .status(quiz.getStatus())
                .createdAt(quiz.getCreatedAt());

        if (includeQuestions) {
            List<Question> questions = questionRepository.findByQuizId(quiz.getId());
            builder.questions(questions.stream().map(q -> mapToQuestionDto(q, true)).collect(Collectors.toList()));
        }

        return builder.build();
    }

    private QuestionDto mapToQuestionDto(Question q, boolean includeOptions) {
        QuestionDto.QuestionDtoBuilder builder = QuestionDto.builder()
                .id(q.getId())
                .quizId(q.getQuiz().getId())
                .questionText(q.getQuestionText())
                .explanation(q.getExplanation())
                .marks(q.getMarks());

        if (includeOptions) {
            List<QuestionOption> options = optionRepository.findByQuestionId(q.getId());
            builder.options(options.stream().map(o -> 
                OptionDto.builder()
                        .id(o.getId())
                        .optionText(o.getOptionText())
                        .isCorrect(o.getIsCorrect())
                        .build()
            ).collect(Collectors.toList()));
        }

        return builder.build();
    }

    private QuizAttemptDto mapToQuizAttemptDto(QuizAttempt attempt) {
        List<StudentAnswerDto> answerDtos = attempt.getStudentAnswers().stream().map(ans -> {
            Question q = ans.getQuestion();
            List<QuestionOption> options = optionRepository.findByQuestionId(q.getId());
            
            QuestionOption selectedOpt = options.stream().filter(o -> o.getId().equals(ans.getSelectedOptionId())).findFirst().orElse(null);
            QuestionOption correctOpt = options.stream().filter(o -> o.getId().equals(ans.getCorrectOptionId())).findFirst().orElse(null);

            return StudentAnswerDto.builder()
                    .id(ans.getId())
                    .questionId(q.getId())
                    .questionText(q.getQuestionText())
                    .explanation(q.getExplanation())
                    .selectedOptionId(ans.getSelectedOptionId())
                    .selectedOptionText(selectedOpt != null ? selectedOpt.getOptionText() : "Unanswered")
                    .correctOptionId(ans.getCorrectOptionId())
                    .correctOptionText(correctOpt != null ? correctOpt.getOptionText() : "N/A")
                    .isCorrect(ans.getIsCorrect())
                    .build();
        }).collect(Collectors.toList());

        return QuizAttemptDto.builder()
                .id(attempt.getId())
                .studentId(attempt.getStudent().getId())
                .studentName(attempt.getStudent().getFirstName() + " " + attempt.getStudent().getLastName())
                .quizId(attempt.getQuiz().getId())
                .quizTitle(attempt.getQuiz().getTitle())
                .quizCategory(attempt.getQuiz().getCategory())
                .score(attempt.getScore())
                .percentage(attempt.getPercentage())
                .resultStatus(attempt.getResultStatus())
                .startedTime(attempt.getStartedTime())
                .completedTime(attempt.getCompletedTime())
                .studentAnswers(answerDtos)
                .build();
    }
}
