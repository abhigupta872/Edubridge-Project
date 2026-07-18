package com.edubridge.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 150)
    private String title;

    @Lob
    private String description;

    @Column(length = 100)
    private String instructor;

    @Column(length = 50)
    private String platform;

    @Column(length = 255)
    private String link;

    @Column(name = "difficulty_level", length = 30)
    private String difficultyLevel;

    private Double rating;

    @Column(length = 255)
    private String tags; // Comma-separated list of target skills, e.g. "Java,Spring"
}
