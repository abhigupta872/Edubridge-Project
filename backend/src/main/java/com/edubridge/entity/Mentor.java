package com.edubridge.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mentors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "user")
@EqualsAndHashCode(exclude = "user")
public class Mentor {

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

    @Lob
    private String bio;

    @Column(length = 100)
    private String company;

    @Column(length = 100)
    private String designation;

    @Column(length = 255)
    private String expertise;
}
