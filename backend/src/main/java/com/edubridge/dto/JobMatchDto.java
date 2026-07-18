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
public class JobMatchDto {
    private Long jobId;
    private Long internshipId;
    private String title;
    private String companyName;
    private String location;
    private Set<String> requiredSkills;
    private int matchPercentage;
    private boolean internship;
}
