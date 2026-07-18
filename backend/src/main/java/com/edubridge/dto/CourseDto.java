package com.edubridge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseDto {
    private Long id;
    private String title;
    private String description;
    private String instructor;
    private String platform;
    private String link;
    private String difficultyLevel;
    private Double rating;
    private String tags; // e.g. "Java, Spring Boot"
}
