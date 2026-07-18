package com.edubridge.service;

import com.edubridge.dto.MentorProfileDto;
import com.edubridge.dto.MentorSessionDto;

import java.util.List;

public interface MentorService {
    MentorProfileDto getMentorProfile(Long mentorId);
    MentorProfileDto updateMentorProfile(Long mentorId, MentorProfileDto dto);
    
    // Session operations
    MentorSessionDto scheduleSession(Long mentorId, MentorSessionDto sessionDto);
    MentorSessionDto bookSession(Long sessionId, Long studentId);
    MentorSessionDto completeSession(Long sessionId, String feedback);
    List<MentorSessionDto> getSessionsByMentor(Long mentorId);
    List<MentorSessionDto> getSessionsByStudent(Long studentId);
    List<MentorSessionDto> getAvailableSessions();
    List<MentorProfileDto> getAllMentors();
}
