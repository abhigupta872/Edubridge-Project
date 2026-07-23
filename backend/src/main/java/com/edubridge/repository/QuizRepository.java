package com.edubridge.repository;

import com.edubridge.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByMentorId(Long mentorId);
    List<Quiz> findByStatus(String status);
}
