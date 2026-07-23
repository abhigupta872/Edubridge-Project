package com.edubridge.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentAnswerDto {
    private Long id;
    private Long questionId;
    private String questionText;
    private String explanation;
    private Long selectedOptionId;
    private String selectedOptionText;
    private Long correctOptionId;
    private String correctOptionText;
    private Boolean isCorrect;
}
