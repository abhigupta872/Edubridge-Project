import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import MentorDashboard from './pages/MentorDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';

import { FiActivity, FiUsers, FiAward, FiBriefcase, FiArrowRight } from 'react-icons/fi';

// Simple beautiful landing page component
const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  return (
    <div className="container py-5 animate-fade-in">
      <div className="row align-items-center mb-5" style={{ minHeight: '60vh' }}>
        <div className="col-lg-6 mb-4 mb-lg-0 animate-slide-up">
          <h1 className="display-4 fw-bold mb-3">
            Bridging the Gap Between <strong className="text-gradient-primary">Students</strong> and <strong className="text-gradient-secondary">Industry</strong>
          </h1>
          <p className="fs-5 text-muted mb-4">
            EDUBRIDGE is an intelligent talent-readiness platform providing skill-gap diagnostics, custom courses, direct developer mentorship, and automated placement matching.
          </p>
          {user ? (
            <Link to={
              user.role === 'STUDENT' ? '/student-dashboard' :
              user.role === 'MENTOR' ? '/mentor-dashboard' :
              user.role === 'RECRUITER' ? '/recruiter-dashboard' : '/admin-dashboard'
            } className="btn btn-premium-primary py-3 px-4 fs-6 hover-scale">
              Go to Dashboard <FiArrowRight className="ms-2" />
            </Link>
          ) : (
            <div className="d-flex gap-3">
              <Link to="/register" className="btn btn-premium-primary py-3 px-4 fs-6 hover-scale">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-premium-outline py-3 px-4 fs-6 hover-scale">
                Sign In
              </Link>
            </div>
          )}
        </div>
        <div className="col-lg-6 text-center animate-fade-in">
          <div className="position-relative d-inline-block">
            {/* Ambient Background Glow for Hero */}
            <div className="position-absolute translate-middle top-50 start-50 rounded-circle" style={{ width: '80%', height: '80%', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 60%)', filter: 'blur(30px)', zIndex: -1 }}></div>
            <div className="card glass-card p-5" style={{ maxWidth: '500px' }}>
              <FiActivity className="mb-3 text-gradient-primary" size={60} />
              <h3 className="fw-bold mb-2">Build Placement Ready Skills</h3>
              <p className="text-muted">Enter student profiles, identify missing industry tags, enroll in target micro-courses, and unlock recruiter pipelines.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 justify-content-center text-center mt-5">
        <h2 className="fw-bold mb-4">Core Pillars</h2>
        <div className="col-md-4">
          <div className="card glass-card p-4 h-100 hover-scale">
            <FiAward className="mx-auto mb-3 text-gradient-primary" size={40} />
            <h4 className="fw-bold">Skill Analysis</h4>
            <p className="text-muted">Compare student portfolios against specific vacancy requirements to generate personalized gap metrics and learning paths.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card glass-card p-4 h-100 hover-scale">
            <FiUsers className="mx-auto mb-3 text-gradient-secondary" size={40} />
            <h4 className="fw-bold">Mentorship Slots</h4>
            <p className="text-muted">Schedule online mock sessions, receive project code evaluations, and connect directly with senior tech leaders.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card glass-card p-4 h-100 hover-scale">
            <FiBriefcase className="mx-auto mb-3 text-gradient-accent" size={40} />
            <h4 className="fw-bold">Job Matching</h4>
            <p className="text-muted">Direct pipelines connecting shortlisted students with verified corporate recruiter posts for full-time jobs or internships.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Student Dashboard */}
            <Route 
              path="/student-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Protected Mentor Dashboard */}
            <Route 
              path="/mentor-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['MENTOR']}>
                  <MentorDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Protected Recruiter Dashboard */}
            <Route 
              path="/recruiter-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['RECRUITER']}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Protected Admin Dashboard */}
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
