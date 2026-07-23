package com.edubridge.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizAttemptDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long quizId;
    private String quizTitle;
    private String quizCategory;
    private Integer score;
    private Double percentage;
    private String resultStatus;
    private LocalDateTime startedTime;
    private LocalDateTime completedTime;
    private List<StudentAnswerDto> studentAnswers;
}
