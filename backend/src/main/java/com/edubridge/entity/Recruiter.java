package com.edubridge.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recruiters")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "user")
@EqualsAndHashCode(exclude = "user")
public class Recruiter {

    @Id
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    private User user;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(length = 15)
    private String phone;

    @Column(name = "company_name", nullable = false, length = 100)
    private String companyName;

    @Column(length = 100)
    private String designation;
}
