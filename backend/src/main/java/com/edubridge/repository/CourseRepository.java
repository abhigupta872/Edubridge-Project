package com.edubridge.repository;

import com.edubridge.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    @Query("SELECT c FROM Course c WHERE LOWER(c.tags) LIKE LOWER(CONCAT('%', :tag, '%'))")
    List<Course> findByTag(@Param("tag") String tag);
}
