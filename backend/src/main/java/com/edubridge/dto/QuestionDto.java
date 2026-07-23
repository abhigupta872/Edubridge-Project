package com.edubridge.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionDto {
    private Long id;
    private Long quizId;
    private String questionText;
    private String explanation;
    private Integer marks;
    private List<OptionDto> options;
}
