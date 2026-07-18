package com.edubridge.repository;

import com.edubridge.entity.Internship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InternshipRepository extends JpaRepository<Internship, Long> {
    List<Internship> findByRecruiterId(Long recruiterId);

    @Query("SELECT DISTINCT i FROM Internship i LEFT JOIN FETCH i.requiredSkills")
    List<Internship> findAllWithSkills();
}
