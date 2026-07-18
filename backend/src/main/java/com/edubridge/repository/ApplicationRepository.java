package com.edubridge.repository;

import com.edubridge.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentId(Long studentId);

    @Query("SELECT a FROM Application a WHERE (a.job IS NOT NULL AND a.job.recruiter.id = :recruiterId) OR (a.internship IS NOT NULL AND a.internship.recruiter.id = :recruiterId)")
    List<Application> findByRecruiterId(@Param("recruiterId") Long recruiterId);

    boolean existsByStudentIdAndJobId(Long studentId, Long jobId);
    boolean existsByStudentIdAndInternshipId(Long studentId, Long internshipId);
}
