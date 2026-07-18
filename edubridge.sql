-- EDUBRIDGE Database SQL Script
-- Target Database: MySQL
-- Pre-sets up schema structure and inserts production-ready sample/test data.

CREATE DATABASE IF NOT EXISTS edubridge;
USE edubridge;

-- Disable foreign key checks for clean teardown
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS internship_skills;
DROP TABLE IF EXISTS job_skills;
DROP TABLE IF EXISTS student_skills;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS internships;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS recruiters;
DROP TABLE IF EXISTS mentors;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. Create Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Create Students table
CREATE TABLE students (
    id BIGINT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(15),
    bio TEXT,
    current_education VARCHAR(100),
    institution VARCHAR(150),
    graduation_year INT,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Create Mentors table
CREATE TABLE mentors (
    id BIGINT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(15),
    bio TEXT,
    company VARCHAR(100),
    designation VARCHAR(100),
    expertise VARCHAR(255),
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Create Recruiters table
CREATE TABLE recruiters (
    id BIGINT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(15),
    company_name VARCHAR(100) NOT NULL,
    designation VARCHAR(100),
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Create Skills table
CREATE TABLE skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 6. Create Courses table
CREATE TABLE courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    instructor VARCHAR(100),
    platform VARCHAR(50),
    link VARCHAR(255),
    difficulty_level VARCHAR(30),
    rating DOUBLE,
    tags VARCHAR(255)
);

-- 7. Create Jobs table
CREATE TABLE jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    company_name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    salary_range VARCHAR(50),
    recruiter_id BIGINT NOT NULL,
    FOREIGN KEY (recruiter_id) REFERENCES recruiters(id) ON DELETE CASCADE
);

-- 8. Create Internships table
CREATE TABLE internships (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    company_name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    duration_months INT,
    stipend VARCHAR(50),
    recruiter_id BIGINT NOT NULL,
    FOREIGN KEY (recruiter_id) REFERENCES recruiters(id) ON DELETE CASCADE
);

-- 9. Create Student Skills Join Table
CREATE TABLE student_skills (
    student_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    PRIMARY KEY (student_id, skill_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- 10. Create Job Skills Join Table
CREATE TABLE job_skills (
    job_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    PRIMARY KEY (job_id, skill_id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- 11. Create Internship Skills Join Table
CREATE TABLE internship_skills (
    internship_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    PRIMARY KEY (internship_id, skill_id),
    FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- 12. Create Applications table
CREATE TABLE applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    job_id BIGINT,
    internship_id BIGINT,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    resume_url VARCHAR(255),
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    feedback TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE
);

-- 13. Create Sessions table
CREATE TABLE sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mentor_id BIGINT NOT NULL,
    student_id BIGINT,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    date_time DATETIME NOT NULL,
    duration_minutes INT NOT NULL,
    meeting_link VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
    feedback TEXT,
    FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL
);

-- 14. Create Notifications table
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    message VARCHAR(255) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================
-- INSERT SEED DATA
-- BCrypt password hashes are for the text: "password123"
-- (Hash: $2a$10$lh1Wq43TqWlU6hQjG3Nq5eyq24oR2hF3sXyq5f8s.Z7p1QxQfKqPy)
-- ==========================================

-- Users
INSERT INTO users (id, email, password, role, is_active) VALUES
(1, 'admin@edubridge.com', '$2a$10$lh1Wq43TqWlU6hQjG3Nq5eyq24oR2hF3sXyq5f8s.Z7p1QxQfKqPy', 'ADMIN', TRUE),
(2, 'student@edubridge.com', '$2a$10$lh1Wq43TqWlU6hQjG3Nq5eyq24oR2hF3sXyq5f8s.Z7p1QxQfKqPy', 'STUDENT', TRUE),
(3, 'mentor@edubridge.com', '$2a$10$lh1Wq43TqWlU6hQjG3Nq5eyq24oR2hF3sXyq5f8s.Z7p1QxQfKqPy', 'MENTOR', TRUE),
(4, 'recruiter@edubridge.com', '$2a$10$lh1Wq43TqWlU6hQjG3Nq5eyq24oR2hF3sXyq5f8s.Z7p1QxQfKqPy', 'RECRUITER', TRUE);

-- Profiles
INSERT INTO students (id, first_name, last_name, phone, bio, current_education, institution, graduation_year) VALUES
(2, 'Alex', 'Smith', '9876543210', 'Aspiring software developer interested in web tech.', 'B.Tech in Computer Science', 'EduBridge University', 2027);

INSERT INTO mentors (id, first_name, last_name, phone, bio, company, designation, expertise) VALUES
(3, 'Dr. Sarah', 'Jenkins', '9876543211', '15+ years of software architecture design.', 'Google', 'Principal Engineer', 'Java, System Design, Spring Boot');

INSERT INTO recruiters (id, first_name, last_name, phone, company_name, designation) VALUES
(4, 'Michael', 'Vance', '9876543212', 'TechCorp Systems', 'Talent Acquisition Manager');

-- Skills
INSERT INTO skills (id, name) VALUES
(1, 'Java'),
(2, 'Spring Boot'),
(3, 'ReactJS'),
(4, 'MySQL'),
(5, 'Python'),
(6, 'System Design'),
(7, 'Machine Learning');

-- Student Skills
INSERT INTO student_skills (student_id, skill_id) VALUES
(2, 1),
(2, 3); -- Alex knows Java and ReactJS

-- Courses
INSERT INTO courses (id, title, description, instructor, platform, link, difficulty_level, rating, tags) VALUES
(1, 'Spring Boot Masterclass', 'Comprehensive guide to building Spring Boot REST APIs.', 'Dr. Sarah Jenkins', 'EduBridge Academy', 'http://localhost:3000/courses/1', 'Intermediate', 4.8, 'Java,Spring Boot'),
(2, 'React Advanced Concepts', 'Master hooks, state management, and custom routers.', 'John Doe', 'Coursera', 'http://localhost:3000/courses/2', 'Advanced', 4.6, 'ReactJS'),
(3, 'MySQL Database Design', 'Learn schema normalization, keys, indexing and SQL optimization.', 'Jane Miller', 'Udemy', 'http://localhost:3000/courses/3', 'Beginner', 4.5, 'MySQL');

-- Jobs
INSERT INTO jobs (id, title, description, company_name, location, salary_range, recruiter_id) VALUES
(1, 'Junior Backend Developer', 'Looking for a Junior Backend Developer to design API servers using Java and Spring Boot.', 'TechCorp Systems', 'New York, USA', '$70,000 - $85,000', 4);

-- Job Skills
INSERT INTO job_skills (job_id, skill_id) VALUES
(1, 1), -- Java
(1, 2), -- Spring Boot
(1, 4); -- MySQL

-- Internships
INSERT INTO internships (id, title, description, company_name, location, duration_months, stipend, recruiter_id) VALUES
(1, 'Full-Stack Developer Intern', 'Join our frontend team working on React components and API integration.', 'TechCorp Systems', 'Remote', 6, '$2,000 / month', 4);

-- Internship Skills
INSERT INTO internship_skills (internship_id, skill_id) VALUES
(1, 3), -- ReactJS
(1, 4); -- MySQL

-- Sessions
INSERT INTO sessions (id, mentor_id, student_id, title, description, date_time, duration_minutes, meeting_link, status, feedback) VALUES
(1, 3, NULL, 'Introduction to System Design', 'Open session mapping microservice foundations.', '2026-06-25 15:00:00', 60, 'https://meet.google.com/abc-defg-hij', 'SCHEDULED', NULL),
(2, 3, 2, 'Mock Interview & Java Deep Dive', 'Personalized mock coding interview with feedback.', '2026-06-21 10:00:00', 45, 'https://meet.google.com/xyz-qprs-tuv', 'SCHEDULED', NULL);

-- Notifications
INSERT INTO notifications (id, user_id, message, is_read, type) VALUES
(1, 2, 'Welcome to EduBridge! Complete your profile to get matched.', FALSE, 'SYSTEM'),
(2, 2, 'New Session Alert: Dr. Sarah has scheduled an available slot.', FALSE, 'SESSION_ALERT');
