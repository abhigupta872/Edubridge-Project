package com.edubridge.service;

import com.edubridge.dto.StudentProfileDto;
import com.edubridge.entity.Skill;
import com.edubridge.entity.Student;
import com.edubridge.exception.ResourceNotFoundException;
import com.edubridge.repository.SkillRepository;
import com.edubridge.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Override
    public StudentProfileDto getStudentProfile(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for ID: " + studentId));
        return mapToDto(student);
    }

    @Override
    @Transactional
    public StudentProfileDto updateStudentProfile(Long studentId, StudentProfileDto dto) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for ID: " + studentId));

        student.setFirstName(dto.getFirstName());
        student.setLastName(dto.getLastName());
        student.setPhone(dto.getPhone());
        student.setBio(dto.getBio());
        student.setCurrentEducation(dto.getCurrentEducation());
        student.setInstitution(dto.getInstitution());
        student.setGraduationYear(dto.getGraduationYear());

        Student updated = studentRepository.save(student);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public StudentProfileDto updateSkills(Long studentId, Set<String> skillNames) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for ID: " + studentId));

        Set<Skill> skills = new HashSet<>();
        if (skillNames != null) {
            for (String name : skillNames) {
                if (name == null || name.trim().isEmpty()) continue;
                String normalized = name.trim();
                Skill skill = skillRepository.findByName(normalized)
                        .orElseGet(() -> skillRepository.save(Skill.builder().name(normalized).build()));
                skills.add(skill);
            }
        }

        student.setSkills(skills);
        Student updated = studentRepository.save(student);
        return mapToDto(updated);
    }

    @Override
    public List<StudentProfileDto> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private StudentProfileDto mapToDto(Student student) {
        Set<String> skillNames = student.getSkills().stream()
                .map(Skill::getName)
                .collect(Collectors.toSet());

        return StudentProfileDto.builder()
                .id(student.getId())
                .email(student.getUser().getEmail())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .phone(student.getPhone())
                .bio(student.getBio())
                .currentEducation(student.getCurrentEducation())
                .institution(student.getInstitution())
                .graduationYear(student.getGraduationYear())
                .skills(skillNames)
                .build();
    }
}
