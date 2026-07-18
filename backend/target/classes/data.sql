-- Seed data for automatic database initialization on application startup

-- 1. Insert Users (BCrypt hashes for 'password123')
-- Hash: $2a$10$lh1Wq43TqWlU6hQjG3Nq5eyq24oR2hF3sXyq5f8s.Z7p1QxQfKqPy
INSERT INTO users (id, email, password, role, is_active) VALUES
(1, 'admin@edubridge.com', '$2a$10$lh1Wq43TqWlU6hQjG3Nq5eyq24oR2hF3sXyq5f8s.Z7p1QxQfKqPy', 'ADMIN', TRUE),
(2, 'student@edubridge.com', '$2a$10$lh1Wq43TqWlU6hQjG3Nq5eyq24oR2hF3sXyq5f8s.Z7p1QxQfKqPy', 'STUDENT', TRUE),
(3, 'mentor@edubridge.com', '$2a$10$lh1Wq43TqWlU6hQjG3Nq5eyq24oR2hF3sXyq5f8s.Z7p1QxQfKqPy', 'MENTOR', TRUE),
(4, 'recruiter@edubridge.com', '$2a$10$lh1Wq43TqWlU6hQjG3Nq5eyq24oR2hF3sXyq5f8s.Z7p1QxQfKqPy', 'RECRUITER', TRUE)
ON DUPLICATE KEY UPDATE password = VALUES(password);

-- 2. Insert Profiles
INSERT IGNORE INTO students (id, first_name, last_name, phone, bio, current_education, institution, graduation_year) VALUES
(2, 'Alex', 'Smith', '9876543210', 'Aspiring software developer interested in web tech.', 'B.Tech in Computer Science', 'EduBridge University', 2027);

INSERT IGNORE INTO mentors (id, first_name, last_name, phone, bio, company, designation, expertise) VALUES
(3, 'Dr. Sarah', 'Jenkins', '9876543211', '15+ years of software architecture design.', 'Google', 'Principal Engineer', 'Java, System Design, Spring Boot');

INSERT IGNORE INTO recruiters (id, first_name, last_name, phone, company_name, designation) VALUES
(4, 'Michael', 'Vance', '9876543212', 'TechCorp Systems', 'Talent Acquisition Manager');

-- 3. Insert Skills
INSERT IGNORE INTO skills (id, name) VALUES
(1, 'Java'),
(2, 'Spring Boot'),
(3, 'ReactJS'),
(4, 'MySQL'),
(5, 'Python'),
(6, 'System Design'),
(7, 'Machine Learning');

-- 4. Student Skills Join
INSERT IGNORE INTO student_skills (student_id, skill_id) VALUES
(2, 1),
(2, 3);

-- 5. Courses
INSERT IGNORE INTO courses (id, title, description, instructor, platform, link, difficulty_level, rating, tags) VALUES
(1, 'Spring Boot Masterclass', 'Comprehensive guide to building Spring Boot REST APIs.', 'Dr. Sarah Jenkins', 'EduBridge Academy', 'http://localhost:3000/courses/1', 'Intermediate', 4.8, 'Java,Spring Boot'),
(2, 'React Advanced Concepts', 'Master hooks, state management, and custom routers.', 'John Doe', 'Coursera', 'http://localhost:3000/courses/2', 'Advanced', 4.6, 'ReactJS'),
(3, 'MySQL Database Design', 'Learn schema normalization, keys, indexing and SQL optimization.', 'Jane Miller', 'Udemy', 'http://localhost:3000/courses/3', 'Beginner', 4.5, 'MySQL');

-- 6. Jobs
INSERT IGNORE INTO jobs (id, title, description, company_name, location, salary_range, recruiter_id) VALUES
(1, 'Junior Backend Developer', 'Looking for a Junior Backend Developer to design API servers using Java and Spring Boot.', 'TechCorp Systems', 'New York, USA', '$70,000 - $85,000', 4);

-- 7. Job Skills Join
INSERT IGNORE INTO job_skills (job_id, skill_id) VALUES
(1, 1),
(1, 2),
(1, 4);

-- 8. Internships
INSERT IGNORE INTO internships (id, title, description, company_name, location, duration_months, stipend, recruiter_id) VALUES
(1, 'Full-Stack Developer Intern', 'Join our frontend team working on React components and API integration.', 'TechCorp Systems', 'Remote', 6, '$2,000 / month', 4);

-- 9. Internship Skills Join
INSERT IGNORE INTO internship_skills (internship_id, skill_id) VALUES
(1, 3),
(1, 4);

-- 10. Sessions
INSERT IGNORE INTO sessions (id, mentor_id, student_id, title, description, date_time, duration_minutes, meeting_link, status, feedback) VALUES
(1, 3, NULL, 'Introduction to System Design', 'Open session mapping microservice foundations.', '2026-06-25 15:00:00', 60, 'https://meet.google.com/abc-defg-hij', 'SCHEDULED', NULL),
(2, 3, 2, 'Mock Interview & Java Deep Dive', 'Personalized mock coding interview with feedback.', '2026-06-21 10:00:00', 45, 'https://meet.google.com/xyz-qprs-tuv', 'SCHEDULED', NULL);

-- 11. Notifications
INSERT IGNORE INTO notifications (id, user_id, message, is_read, type, created_at) VALUES
(1, 2, 'Welcome to EduBridge! Complete your profile to get matched.', FALSE, 'SYSTEM', CURRENT_TIMESTAMP),
(2, 2, 'New Session Alert: Dr. Sarah has scheduled an available slot.', FALSE, 'SESSION_ALERT', CURRENT_TIMESTAMP);
