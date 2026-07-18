package com.edubridge.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "internships")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"recruiter", "requiredSkills"})
@EqualsAndHashCode(exclude = {"recruiter", "requiredSkills"})
public class Internship {

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

    @Column(name = "duration_months")
    private Integer durationMonths;

    @Column(length = 50)
    private String stipend;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruiter_id", nullable = false)
    private Recruiter recruiter;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "internship_skills",
            joinColumns = @JoinColumn(name = "internship_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @Builder.Default
    private Set<Skill> requiredSkills = new HashSet<>();
}
