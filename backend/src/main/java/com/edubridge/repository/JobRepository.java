package com.edubridge.repository;

import com.edubridge.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByRecruiterId(Long recruiterId);

    @Query("SELECT DISTINCT j FROM Job j LEFT JOIN FETCH j.requiredSkills")
    List<Job> findAllWithSkills();
}
