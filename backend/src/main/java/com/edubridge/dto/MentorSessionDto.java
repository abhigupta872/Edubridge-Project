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
public class MentorSessionDto {
    private Long id;
    private Long mentorId;
    private String mentorName;
    private Long studentId;
    private String studentName;
    private String title;
    private String description;
    private LocalDateTime dateTime;
    private Integer durationMinutes;
    private String meetingLink;
    private String status;
    private String feedback;
}
