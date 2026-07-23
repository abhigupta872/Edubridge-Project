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
public class InternshipDto {
    private Long id;
    private String title;
    private String description;
    private String companyName;
    private String location;
    private Integer durationMonths;
    private String stipend;
    private Set<String> requiredSkills;
    private Long recruiterId;
    private String recruiterName;
    private String status;
    private java.time.LocalDateTime postedDate;
}
