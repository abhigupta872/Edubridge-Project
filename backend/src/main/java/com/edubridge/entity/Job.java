package com.edubridge.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"recruiter", "requiredSkills"})
@EqualsAndHashCode(exclude = {"recruiter", "requiredSkills"})
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Lob
    private String description;

    @Column(name = "company_name", nullable = false, length = 100)
    private String companyName;

    @Column(length = 100)
    private String location;

    @Column(name = "salary_range", length = 50)
    private String salaryRange;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruiter_id", nullable = false)
    private Recruiter recruiter;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "job_skills",
            joinColumns = @JoinColumn(name = "job_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @Builder.Default
    private Set<Skill> requiredSkills = new HashSet<>();

    @Column(length = 30)
    @Builder.Default
    private String status = "ACTIVE";

    @Column(name = "posted_date")
    @Builder.Default
    private java.time.LocalDateTime postedDate = java.time.LocalDateTime.now();
}
