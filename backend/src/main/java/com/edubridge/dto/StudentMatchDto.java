package com.edubridge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentMatchDto {
    private Long studentId;
    private String firstName;
    private String lastName;
    private Set<String> skills;
    private String currentEducation;
    private String institution;
    private int matchPercentage;
}
