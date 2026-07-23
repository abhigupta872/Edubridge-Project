package com.edubridge.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quiz_attempts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"student", "quiz", "studentAnswers"})
@EqualsAndHashCode(exclude = {"student", "quiz", "studentAnswers"})
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    private Integer score;

    private Double percentage;

    @Column(name = "result_status", length = 20)
    private String resultStatus; // PASSED, FAILED

    @Column(name = "started_time")
    private LocalDateTime startedTime;

    @Column(name = "completed_time")
    private LocalDateTime completedTime;

    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<StudentAnswer> studentAnswers = new ArrayList<>();
}
