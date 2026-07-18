package com.edubridge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillGapReportDto {
    private Long studentId;
    private Long jobId;
    private Long internshipId;
    private String title;
    private String companyName;
    private List<String> matchingSkills;
    private List<String> missingSkills;
    private List<CourseDto> recommendedCourses;
}
