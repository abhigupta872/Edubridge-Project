package com.edubridge.dto;

import com.edubridge.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank
    @Email
    @Size(max = 100)
    private String email;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    @NotNull
    private UserRole role;

    // Common Profile fields
    @NotBlank
    @Size(max = 50)
    private String firstName;

    @NotBlank
    @Size(max = 50)
    private String lastName;

    @Size(max = 15)
    private String phone;

    private String bio;

    // Student specific
    private String currentEducation;
    private String institution;
    private Integer graduationYear;

    // Recruiter specific
    private String companyName;
    
    // Mentor/Recruiter/Common
    private String designation;
    private String company; // Mentor specific company

    // Mentor specific
    private String expertise;
}
