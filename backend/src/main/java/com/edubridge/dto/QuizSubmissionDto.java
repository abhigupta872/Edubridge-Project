package com.edubridge.dto;

import lombok.*;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizSubmissionDto {
    private Map<Long, Long> answers; // Map from Question ID -> Selected Option ID
}
