package com.edubridge.service;

import com.edubridge.dto.MentorProfileDto;
import com.edubridge.dto.MentorSessionDto;
import com.edubridge.entity.Mentor;
import com.edubridge.entity.MentorSession;
import com.edubridge.entity.Student;
import com.edubridge.enums.SessionStatus;
import com.edubridge.exception.BadRequestException;
import com.edubridge.exception.ResourceNotFoundException;
import com.edubridge.repository.MentorRepository;
import com.edubridge.repository.MentorSessionRepository;
import com.edubridge.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MentorServiceImpl implements MentorService {

    @Autowired
    private MentorRepository mentorRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private MentorSessionRepository mentorSessionRepository;

    @Override
    public MentorProfileDto getMentorProfile(Long mentorId) {
        Mentor mentor = mentorRepository.findById(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found for ID: " + mentorId));
        return mapToDto(mentor);
    }

    @Override
    @Transactional
    public MentorProfileDto updateMentorProfile(Long mentorId, MentorProfileDto dto) {
        Mentor mentor = mentorRepository.findById(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found for ID: " + mentorId));

        mentor.setFirstName(dto.getFirstName());
        mentor.setLastName(dto.getLastName());
        mentor.setPhone(dto.getPhone());
        mentor.setBio(dto.getBio());
        mentor.setCompany(dto.getCompany());
        mentor.setDesignation(dto.getDesignation());
        mentor.setExpertise(dto.getExpertise());

        Mentor updated = mentorRepository.save(mentor);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public MentorSessionDto scheduleSession(Long mentorId, MentorSessionDto sessionDto) {
        Mentor mentor = mentorRepository.findById(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor profile not found for ID: " + mentorId));

        MentorSession session = MentorSession.builder()
                .mentor(mentor)
                .title(sessionDto.getTitle())
                .description(sessionDto.getDescription())
                .dateTime(sessionDto.getDateTime())
                .durationMinutes(sessionDto.getDurationMinutes())
                .meetingLink(sessionDto.getMeetingLink())
                .status(SessionStatus.SCHEDULED)
                .build();

        MentorSession saved = mentorSessionRepository.save(session);
        return mapToSessionDto(saved);
    }

    @Override
    @Transactional
    public MentorSessionDto bookSession(Long sessionId, Long studentId) {
        MentorSession session = mentorSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found for ID: " + sessionId));

        if (session.getStudent() != null) {
            throw new BadRequestException("This session is already booked!");
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for ID: " + studentId));

        session.setStudent(student);
        MentorSession saved = mentorSessionRepository.save(session);
        return mapToSessionDto(saved);
    }

    @Override
    @Transactional
    public MentorSessionDto completeSession(Long sessionId, String feedback) {
        MentorSession session = mentorSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found for ID: " + sessionId));

        session.setStatus(SessionStatus.COMPLETED);
        session.setFeedback(feedback);

        MentorSession saved = mentorSessionRepository.save(session);
        return mapToSessionDto(saved);
    }

    @Override
    public List<MentorSessionDto> getSessionsByMentor(Long mentorId) {
        return mentorSessionRepository.findByMentorId(mentorId).stream()
                .map(this::mapToSessionDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MentorSessionDto> getSessionsByStudent(Long studentId) {
        return mentorSessionRepository.findByStudentId(studentId).stream()
                .map(this::mapToSessionDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MentorSessionDto> getAvailableSessions() {
        return mentorSessionRepository.findByStudentIdIsNullAndStatus(SessionStatus.SCHEDULED).stream()
                .map(this::mapToSessionDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MentorProfileDto> getAllMentors() {
        return mentorRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private MentorProfileDto mapToDto(Mentor mentor) {
        return MentorProfileDto.builder()
                .id(mentor.getId())
                .email(mentor.getUser().getEmail())
                .firstName(mentor.getFirstName())
                .lastName(mentor.getLastName())
                .phone(mentor.getPhone())
                .bio(mentor.getBio())
                .company(mentor.getCompany())
                .designation(mentor.getDesignation())
                .expertise(mentor.getExpertise())
                .build();
    }

    private MentorSessionDto mapToSessionDto(MentorSession s) {
        return MentorSessionDto.builder()
                .id(s.getId())
                .mentorId(s.getMentor().getId())
                .mentorName(s.getMentor().getFirstName() + " " + s.getMentor().getLastName())
                .studentId(s.getStudent() != null ? s.getStudent().getId() : null)
                .studentName(s.getStudent() != null ? s.getStudent().getFirstName() + " " + s.getStudent().getLastName() : null)
                .title(s.getTitle())
                .description(s.getDescription())
                .dateTime(s.getDateTime())
                .durationMinutes(s.getDurationMinutes())
                .meetingLink(s.getMeetingLink())
                .status(s.getStatus().name())
                .feedback(s.getFeedback())
                .build();
    }
}
