package com.edubridge.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "student_answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"attempt", "question"})
@EqualsAndHashCode(exclude = {"attempt", "question"})
public class StudentAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id", nullable = false)
    private QuizAttempt attempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "selected_option_id")
    private Long selectedOptionId;

    @Column(name = "correct_option_id")
    private Long correctOptionId;

    @Column(name = "is_correct", nullable = false)
    @Builder.Default
    private Boolean isCorrect = false;
}
