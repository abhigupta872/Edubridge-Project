package com.edubridge.repository;

import com.edubridge.entity.MentorSession;
import com.edubridge.enums.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentorSessionRepository extends JpaRepository<MentorSession, Long> {
    List<MentorSession> findByMentorId(Long mentorId);
    List<MentorSession> findByStudentId(Long studentId);
    List<MentorSession> findByStudentIdIsNullAndStatus(SessionStatus status);
}
