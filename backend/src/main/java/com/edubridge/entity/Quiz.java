package com.edubridge.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quizzes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"mentor"})
@EqualsAndHashCode(exclude = {"mentor"})
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_id", nullable = false)
    private Mentor mentor;

    @Column(nullable = false, length = 150)
    private String title;

    @Lob
    private String description;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = false, length = 30)
    private String difficulty;

    @Column(name = "time_limit")
    private Integer timeLimit; // in minutes

    @Column(name = "total_marks")
    private Integer totalMarks;

    @Column(name = "passing_percentage")
    private Integer passingPercentage;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "DRAFT"; // DRAFT, PUBLISHED

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
