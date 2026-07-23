-- Seed data for automatic database initialization on application startup

-- 1. Insert Users (BCrypt hashes for 'password123')
-- Hash: $2a$10$lh1Wq43TqWlU6hQjG3Nq5eyq24oR2hF3sXyq5f8s.Z7p1QxQfKqPy
INSERT INTO users (id, email, password, role, is_active) VALUES
(1, 'admin@edubridge.com', '$2a$10$RDFcc0msRTwSgGhoxN7OL.aL6K2XMRhktEj89WymkgNAlcO.XZuia', 'ADMIN', TRUE),
(2, 'student@edubridge.com', '$2a$10$KbSXirbs1aoBjrCOfa3P6.PvbWunDcYxMw4h3mdCvU.lAKny8uxke', 'STUDENT', TRUE),
(3, 'mentor@edubridge.com', '$2a$10$6BYMKCK2YRK3GhjsxfpdruEeV2tDkXyYWcnhGfuEw9AzqX/shVEVu', 'MENTOR', TRUE),
(4, 'recruiter@edubridge.com', '$2a$10$tV6xsdmaDnpJqq45AeeUm.ghDWRS/WDhrf/cyjal9kIzDja8uoOG.', 'RECRUITER', TRUE)
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
(1, 'Spring Boot Masterclass', 'Comprehensive guide to building Spring Boot REST APIs.', 'Dr. Sarah Jenkins', 'EduBridge Academy', 'https://spring.io/projects/spring-boot', 'Intermediate', 4.8, 'Java,Spring Boot'),
(2, 'React Advanced Concepts', 'Master hooks, state management, and custom routers.', 'John Doe', 'Coursera', 'https://react.dev', 'Advanced', 4.6, 'ReactJS'),
(3, 'MySQL Database Design', 'Learn schema normalization, keys, indexing and SQL optimization.', 'Jane Miller', 'Udemy', 'https://www.udemy.com', 'Beginner', 4.5, 'MySQL');


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

-- 12. Seed Quizzes
INSERT IGNORE INTO quizzes (id, mentor_id, title, description, category, difficulty, time_limit, total_marks, passing_percentage, status, created_at) VALUES
(1, 3, 'Java OOP Fundamentals', 'Test your knowledge of Java inheritance, polymorphism, encapsulation, and abstraction with real-world MCQs.', 'Java', 'Beginner', 10, 3, 66, 'PUBLISHED', CURRENT_TIMESTAMP);

-- 13. Seed Questions
INSERT IGNORE INTO questions (id, quiz_id, question_text, explanation, marks) VALUES
(1, 1, 'Which keyword is used to inherit a class in Java?', 'The "extends" keyword is used to inherit properties and methods of a parent class.', 1),
(2, 1, 'What is the default value of a local variable in Java?', 'Local variables in Java do not have default values. They must be initialized before use.', 1),
(3, 1, 'Which of the following is not a pillar of OOP?', 'Compilation is a process of converting source code into bytecode, not a structural pillar of Object-Oriented Programming.', 1);

-- 14. Seed Question Options
INSERT IGNORE INTO options (id, question_id, option_text, is_correct) VALUES
(1, 1, 'extends', TRUE),
(2, 1, 'implements', FALSE),
(3, 1, 'inherits', FALSE),
(4, 1, 'exports', FALSE),
(5, 2, '0', FALSE),
(6, 2, 'null', FALSE),
(7, 2, 'No default value', TRUE),
(8, 2, 'depends on system', FALSE),
(9, 3, 'Inheritance', FALSE),
(10, 3, 'Compilation', TRUE),
(11, 3, 'Polymorphism', FALSE),
(12, 3, 'Encapsulation', FALSE);

