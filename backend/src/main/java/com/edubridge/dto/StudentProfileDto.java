package com.edubridge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfileDto {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String bio;
    private String currentEducation;
    private String institution;
    private Integer graduationYear;
    private Set<String> skills;
}
