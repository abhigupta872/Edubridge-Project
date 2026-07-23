package com.edubridge.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizDto {
    private Long id;
    private Long mentorId;
    private String mentorName;
    private String title;
    private String description;
    private String category;
    private String difficulty;
    private Integer timeLimit;
    private Integer totalMarks;
    private Integer passingPercentage;
    private String status;
    private LocalDateTime createdAt;
    private List<QuestionDto> questions;
}
