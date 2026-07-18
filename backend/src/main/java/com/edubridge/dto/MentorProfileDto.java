package com.edubridge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MentorProfileDto {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String bio;
    private String company;
    private String designation;
    private String expertise;
}
