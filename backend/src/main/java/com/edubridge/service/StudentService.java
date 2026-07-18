package com.edubridge.service;

import com.edubridge.dto.StudentProfileDto;

import java.util.List;
import java.util.Set;

public interface StudentService {
    StudentProfileDto getStudentProfile(Long studentId);
    StudentProfileDto updateStudentProfile(Long studentId, StudentProfileDto dto);
    StudentProfileDto updateSkills(Long studentId, Set<String> skillNames);
    List<StudentProfileDto> getAllStudents();
}
