# EDUBRIDGE - Full-Stack Skill Gap and Placement Matching System

EDUBRIDGE is a web platform designed to bridge the skill gap between students and industry. Using role-based JWT authentication, a Spring Boot 3 / Java 21 REST API backend, and a Vite-ReactJS frontend, it provides an end-to-end framework for students to self-assess skills, learn through course recommendations, receive mentorship guidance, and get matched to jobs and internships.

---

## 🛠️ Technology Stack

### Backend
- **Java 21**
- **Spring Boot 3.x** (with Spring Security, Web MVC)
- **Spring Data JPA** & **Hibernate**
- **JWT (Json Web Tokens)** for stateless authentication
- **Maven** for build automation
- **Lombok**
- **Swagger / OpenAPI** for API documentation

### Frontend
- **ReactJS** with **Vite**
- **React Router v6**
- **Axios** for API orchestration
- **Bootstrap 5** for grid styling
- **React Icons** for modern iconography

### Database
- **MySQL 8.x**

---

## 🏗️ System Architecture

EDUBRIDGE utilizes an MVC layered architecture communicating via secure REST APIs:

```
[React Frontend Client] 
         │
         ▼ (HTTPS JSON Requests with Bearer JWT)
[Spring Boot REST Controller Layer]
         │
         ▼ (DTO Mapper)
[Service Layer & Algorithms (Matching / Gap Analysis)]
         │
         ▼
[Data Repository Layer (Spring Data JPA)]
         │
         ▼ (SQL Operations)
   [MySQL Database]
```

---

## 🗄️ Database Setup

1. Make sure a MySQL server is running on `localhost:3306`.
2. Open your terminal or a MySQL client (like Workbench) and run the initialization script:
   ```bash
   mysql -u root -p < edubridge.sql
   ```
   *(Note: The default credentials in `application.properties` are username `root` and password `root`. You can modify these settings inside [application.properties](file:///e:/EDUBRIDGE%20P/backend/src/main/resources/application.properties) if necessary).*

---

## 🚀 How to Run

### Step 1: Start the Backend REST API
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Build the project to verify dependencies:
   ```bash
   mvn clean compile
   ```
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
4. The server will launch on `http://localhost:8080/api`.
5. Access the API documentation via Swagger UI: `http://localhost:8080/api/swagger-ui.html`.

### Step 2: Start the React Frontend Client
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the node package dependencies:
   ```bash
   npm install
   ```
3. Start the Vite local development server:
   ```bash
   npm run dev
   ```
4. The client will open on `http://localhost:5173`.

---

## 🔑 Default Accounts (Seed Data)
For immediate testing, use the following credentials:

1. **Student Account**
   - **Email:** `student@edubridge.com`
   - **Password:** `student123`
   - **Use Case:** Manage skills, view job recommendations, generate gap diagnostics, book mock interviews.

2. **Mentor Account**
   - **Email:** `mentor@edubridge.com`
   - **Password:** `mentor123`
   - **Use Case:** Manage profile, schedule slots, view booked rosters, submit mentee session evaluations.

3. **Recruiter Account**
   - **Email:** `recruiter@edubridge.com`
   - **Password:** `recruiter123`
   - **Use Case:** Post jobs/internships, search student database by skill matching, shortlist candidate resumes.

4. **Admin Account**
   - **Email:** `admin@edubridge.com`
   - **Password:** `admin123`
   - **Use Case:** View platform metrics, delete accounts, register/edit course listings.

---

## 🗺️ REST API Endpoints Overview

| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Public | Signup new Student, Mentor, or Recruiter |
| **POST** | `/api/auth/login` | Public | Authentication, returns JWT |
| **GET** | `/api/student/profile` | Student | Retrieve student details |
| **PUT** | `/api/student/skills` | Student | Modify skills set |
| **GET** | `/api/student/gap-report` | Student | Compare student skills with job requirements |
| **POST** | `/api/student/apply/job/{id}` | Student | Submit resume for job |
| **POST** | `/api/mentor/sessions` | Mentor | Schedule mentorship session |
| **POST** | `/api/recruiter/jobs` | Recruiter | Post job opening |
| **GET** | `/api/recruiter/students/search` | Recruiter | Search students matching skill filters |
| **GET** | `/api/admin/dashboard-stats` | Admin | Overall platform activity analytics |
| **GET** | `/api/courses/list` | Public | Get public catalog courses |
