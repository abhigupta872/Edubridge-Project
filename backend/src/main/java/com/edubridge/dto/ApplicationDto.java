package com.edubridge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long jobId;
    private String jobTitle;
    private Long internshipId;
    private String internshipTitle;
    private String companyName;
    private String status;
    private String resumeUrl;
    private LocalDateTime appliedDate;
    private String feedback;
}
