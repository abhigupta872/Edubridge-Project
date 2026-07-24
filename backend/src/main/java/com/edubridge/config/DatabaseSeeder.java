package com.edubridge.config;

import com.edubridge.entity.*;
import com.edubridge.enums.UserRole;
import com.edubridge.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private MentorRepository mentorRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed users and force correct BCrypt passwords matching README credentials
        seedUser("admin@edubridge.com", UserRole.ADMIN, passwordEncoder.encode("admin123"));
        seedUser("student@edubridge.com", UserRole.STUDENT, passwordEncoder.encode("student123"));
        seedUser("mentor@edubridge.com", UserRole.MENTOR, passwordEncoder.encode("mentor123"));
        seedUser("recruiter@edubridge.com", UserRole.RECRUITER, passwordEncoder.encode("recruiter123"));
    }

    private void seedUser(String email, UserRole role, String encodedPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        User user;
        if (userOpt.isPresent()) {
            user = userOpt.get();
            // Force update password to ensure it is BCrypt encoded
            user.setPassword(encodedPassword);
            user.setRole(role); // ensure correct role
            user = userRepository.save(user);
            System.out.println("[DatabaseSeeder] Updated password/role for seed user: " + email);
        } else {
            user = User.builder()
                    .email(email)
                    .password(encodedPassword)
                    .role(role)
                    .active(true)
                    .build();
            user = userRepository.save(user);
            System.out.println("[DatabaseSeeder] Created seed user: " + email);
        }

        // Seed default profile values if missing to prevent dashboard load crash
        if (role == UserRole.STUDENT) {
            if (!studentRepository.existsById(user.getId())) {
                Student student = Student.builder()
                        .user(user)
                        .firstName("Alex")
                        .lastName("Smith")
                        .phone("9876543210")
                        .bio("Aspiring software developer interested in web tech.")
                        .currentEducation("B.Tech in Computer Science")
                        .institution("EduBridge University")
                        .graduationYear(2027)
                        .build();
                studentRepository.save(student);
                System.out.println("[DatabaseSeeder] Seeded default profile for Student: " + email);
            }
        } else if (role == UserRole.MENTOR) {
            if (!mentorRepository.existsById(user.getId())) {
                Mentor mentor = Mentor.builder()
                        .user(user)
                        .firstName("Sarah")
                        .lastName("Jenkins")
                        .phone("9876543211")
                        .bio("15+ years of software architecture design.")
                        .company("Google")
                        .designation("Principal Engineer")
                        .expertise("Java, System Design, Spring Boot")
                        .build();
                mentorRepository.save(mentor);
                System.out.println("[DatabaseSeeder] Seeded default profile for Mentor: " + email);
            }
        } else if (role == UserRole.RECRUITER) {
            if (!recruiterRepository.existsById(user.getId())) {
                Recruiter recruiter = Recruiter.builder()
                        .user(user)
                        .firstName("Michael")
                        .lastName("Vance")
                        .phone("9876543212")
                        .companyName("TechCorp Systems")
                        .designation("Talent Acquisition Manager")
                        .build();
                recruiterRepository.save(recruiter);
                System.out.println("[DatabaseSeeder] Seeded default profile for Recruiter: " + email);
            }
        }
    }
}
