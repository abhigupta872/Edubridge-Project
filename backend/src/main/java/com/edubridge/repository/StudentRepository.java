package com.edubridge.repository;

import com.edubridge.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    @Query("SELECT s FROM Student s JOIN s.skills sk WHERE sk.name = :skillName")
    List<Student> findBySkillName(@Param("skillName") String skillName);

    @Query("SELECT DISTINCT s FROM Student s LEFT JOIN FETCH s.skills")
    List<Student> findAllWithSkills();
}
