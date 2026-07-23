package com.edubridge.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OptionDto {
    private Long id;
    private String optionText;
    private Boolean isCorrect;
}
