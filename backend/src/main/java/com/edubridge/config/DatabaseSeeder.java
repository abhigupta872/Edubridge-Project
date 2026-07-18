package com.edubridge.config;

import com.edubridge.entity.User;
import com.edubridge.enums.UserRole;
import com.edubridge.repository.UserRepository;
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
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String defaultPassword = "password123";
        String encodedPassword = passwordEncoder.encode(defaultPassword);

        // Seed users and force correct BCrypt passwords
        seedUser("admin@edubridge.com", UserRole.ADMIN, encodedPassword);
        seedUser("student@edubridge.com", UserRole.STUDENT, encodedPassword);
        seedUser("mentor@edubridge.com", UserRole.MENTOR, encodedPassword);
        seedUser("recruiter@edubridge.com", UserRole.RECRUITER, encodedPassword);
    }

    private void seedUser(String email, UserRole role, String encodedPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Force update password to ensure it is BCrypt encoded
            user.setPassword(encodedPassword);
            user.setRole(role); // ensure correct role
            userRepository.save(user);
            System.out.println("[DatabaseSeeder] Updated password/role for seed user: " + email);
        } else {
            User user = User.builder()
                    .email(email)
                    .password(encodedPassword)
                    .role(role)
                    .active(true)
                    .build();
            userRepository.save(user);
            System.out.println("[DatabaseSeeder] Created seed user: " + email);
        }
    }
}
