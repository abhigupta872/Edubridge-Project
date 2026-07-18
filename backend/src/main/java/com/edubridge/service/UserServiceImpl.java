package com.edubridge.service;

import com.edubridge.config.JwtUtils;
import com.edubridge.dto.JwtResponse;
import com.edubridge.dto.LoginRequest;
import com.edubridge.dto.RegisterRequest;
import com.edubridge.entity.Mentor;
import com.edubridge.entity.Recruiter;
import com.edubridge.entity.Student;
import com.edubridge.entity.User;
import com.edubridge.enums.UserRole;
import com.edubridge.exception.BadRequestException;
import com.edubridge.exception.ResourceNotFoundException;
import com.edubridge.repository.MentorRepository;
import com.edubridge.repository.RecruiterRepository;
import com.edubridge.repository.StudentRepository;
import com.edubridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private AuthenticationManager authenticationManager;

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

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new JwtResponse(jwt, user.getId(), user.getEmail(), user.getRole().name());
    }

    @Override
    @Transactional
    public User registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email is already taken!");
        }

        // Create user
        User user = User.builder()
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(registerRequest.getRole())
                .active(true)
                .build();

        User savedUser = userRepository.save(user);

        // Build corresponding profile
        if (registerRequest.getRole() == UserRole.STUDENT) {
            Student student = Student.builder()
                    .user(savedUser)
                    .firstName(registerRequest.getFirstName())
                    .lastName(registerRequest.getLastName())
                    .phone(registerRequest.getPhone())
                    .bio(registerRequest.getBio())
                    .currentEducation(registerRequest.getCurrentEducation())
                    .institution(registerRequest.getInstitution())
                    .graduationYear(registerRequest.getGraduationYear())
                    .build();
            studentRepository.save(student);
        } else if (registerRequest.getRole() == UserRole.MENTOR) {
            Mentor mentor = Mentor.builder()
                    .user(savedUser)
                    .firstName(registerRequest.getFirstName())
                    .lastName(registerRequest.getLastName())
                    .phone(registerRequest.getPhone())
                    .bio(registerRequest.getBio())
                    .company(registerRequest.getCompany())
                    .designation(registerRequest.getDesignation())
                    .expertise(registerRequest.getExpertise())
                    .build();
            mentorRepository.save(mentor);
        } else if (registerRequest.getRole() == UserRole.RECRUITER) {
            Recruiter recruiter = Recruiter.builder()
                    .user(savedUser)
                    .firstName(registerRequest.getFirstName())
                    .lastName(registerRequest.getLastName())
                    .phone(registerRequest.getPhone())
                    .companyName(registerRequest.getCompanyName())
                    .designation(registerRequest.getDesignation())
                    .build();
            recruiterRepository.save(recruiter);
        }

        return savedUser;
    }

    @Override
    public long countUsersByRole(UserRole role) {
        return userRepository.countByRole(role);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        // Remove dependent profiles first
        if (user.getRole() == UserRole.STUDENT) {
            studentRepository.deleteById(userId);
        } else if (user.getRole() == UserRole.MENTOR) {
            mentorRepository.deleteById(userId);
        } else if (user.getRole() == UserRole.RECRUITER) {
            recruiterRepository.deleteById(userId);
        }
        
        userRepository.delete(user);
    }

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }
}
