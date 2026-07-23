import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  FiAward, FiBookOpen, FiBriefcase, FiCalendar, FiTrendingUp, 
  FiPlusCircle, FiXCircle, FiCheckCircle, FiFileText, FiEye, 
  FiExternalLink, FiStar, FiClock, FiPlay, FiBook, FiList,
  FiUser, FiSearch
} from 'react-icons/fi';

// Helper for dynamic themed SVG Course Icons
const getCourseIcon = (tags = '') => {
  const normalized = tags.toLowerCase();
  let color = '#8b5cf6'; // Default Purple
  let path = null;
  
  if (normalized.includes('java') && !normalized.includes('javascript')) {
    color = '#f97316'; // Orange
    path = (
      <g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 28 C 12 36, 32 36, 32 28 L 32 16 L 12 16 Z" />
        <path d="M32 20 C 36 20, 38 23, 36 26 C 34 29, 32 28, 32 28" />
        <path d="M10 36 L 34 36" />
        <path d="M17 12 C 17 8, 19 8, 19 4" />
        <path d="M22 12 C 22 8, 24 8, 24 4" />
        <path d="M27 12 C 27 8, 29 8, 29 4" />
      </g>
    );
  } else if (normalized.includes('spring') || normalized.includes('boot')) {
    color = '#10b981'; // Green
    path = (
      <g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 6 C 12 16, 12 32, 24 38 C 36 32, 36 16, 24 6 Z" />
        <path d="M24 6 L 24 38" />
        <path d="M24 18 C 28 18, 30 16, 32 12" />
        <path d="M24 24 C 20 24, 18 22, 16 18" />
        <path d="M24 30 C 28 30, 30 28, 32 24" />
      </g>
    );
  } else if (normalized.includes('react') || normalized.includes('redux') || normalized.includes('javascript') || normalized.includes('js')) {
    color = '#06b6d4'; // Cyan
    path = (
      <g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="24" cy="24" rx="6" ry="18" transform="rotate(30 24 24)" />
        <ellipse cx="24" cy="24" rx="6" ry="18" transform="rotate(90 24 24)" />
        <ellipse cx="24" cy="24" rx="6" ry="18" transform="rotate(150 24 24)" />
        <circle cx="24" cy="24" r="2.5" fill="currentColor" />
      </g>
    );
  } else if (normalized.includes('mysql') || normalized.includes('sql') || normalized.includes('db')) {
    color = '#3b82f6'; // Blue
    path = (
      <g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 12 C 12 8, 36 8, 36 12 L 36 20 C 36 24, 12 24, 12 20 Z" />
        <path d="M12 20 L 12 28 C 12 32, 36 32, 36 28 L 36 20" />
        <path d="M12 28 L 12 36 C 12 40, 36 40, 36 36 L 36 28" />
        <path d="M12 12 C 12 16, 36 16, 36 12" />
      </g>
    );
  } else if (normalized.includes('python')) {
    color = '#eab308'; // Yellow
    path = (
      <g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 6 L 14 6 C 10 6, 8 8, 8 12 L 8 20 C 8 24, 10 26, 14 26 L 22 26 C 26 26, 26 28, 26 32 L 26 36" />
        <path d="M26 42 L 34 42 C 38 42, 40 40, 40 36 L 40 28 C 40 24, 38 22, 34 22 L 26 22 C 22 22, 22 20, 22 16 L 22 12" />
        <circle cx="12" cy="11" r="1.5" fill="currentColor" />
        <circle cx="36" cy="37" r="1.5" fill="currentColor" />
      </g>
    );
  } else {
    path = (
      <g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 12 C 10 8, 38 8, 38 12 L 38 34 C 38 38, 10 38, 10 34 Z" />
        <path d="M10 12 L 10 34" />
        <path d="M14 18 L 34 18" />
        <path d="M14 24 L 34 24" />
        <path d="M14 30 L 28 30" />
      </g>
    );
  }

  return (
    <div style={{ width: '50px', height: '50px', flexShrink: 0 }}>
      <svg viewBox="0 0 48 48" className="w-100 h-100">
        <rect width="48" height="48" rx="8" fill={`${color}15`} />
        {path}
      </svg>
    </div>
  );
};

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [skillsList, setSkillsList] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  
  // Dashboard Tab Configuration
  const [activeTab, setActiveTab] = useState('portfolio'); // portfolio, assessments

  // Recommendations
  const [courses, setCourses] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  
  // Mentorship
  const [sessions, setSessions] = useState([]);
  const [availableSessions, setAvailableSessions] = useState([]);

  // Skill Gap Report
  const [selectedPositionId, setSelectedPositionId] = useState('');
  const [isInternship, setIsInternship] = useState(false);
  const [gapReport, setGapReport] = useState(null);
  const [gapLoading, setGapLoading] = useState(false);

  // Student Assessments State
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [quizzesSearch, setQuizzesSearch] = useState('');
  const [quizzesCategoryFilter, setQuizzesCategoryFilter] = useState('All');
  const [attemptsHistory, setAttemptsHistory] = useState([]);
  const [studentPerformance, setStudentPerformance] = useState(null);
  const [quizzesLoading, setQuizzesLoading] = useState(false);

  // Quiz Attempt System State
  const [activeQuizForAttempt, setActiveQuizForAttempt] = useState(null);
  const [quizDetails, setQuizDetails] = useState(null);
  const [attemptStep, setAttemptStep] = useState('instructions'); // instructions, exam, result, review
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // QuestionId -> OptionId
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [activeAttemptResult, setActiveAttemptResult] = useState(null);
  const [selectedReviewAttempt, setSelectedReviewAttempt] = useState(null);

  // Edit Profile Mode
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
    currentEducation: '',
    institution: '',
    graduationYear: ''
  });

  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Timer Hook
  useEffect(() => {
    if (activeQuizForAttempt && attemptStep === 'exam' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (activeQuizForAttempt && attemptStep === 'exam' && timeLeft === 0) {
      addToast('Time limit reached! Submitting quiz automatically.', 'warning');
      triggerQuizSubmission();
    }
  }, [activeQuizForAttempt, attemptStep, timeLeft]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const profileRes = await api.get('/student/profile');
      setProfile(profileRes.data);
      setSkillsList(Array.from(profileRes.data.skills || []));
      setEditForm({
        firstName: profileRes.data.firstName,
        lastName: profileRes.data.lastName,
        phone: profileRes.data.phone || '',
        bio: profileRes.data.bio || '',
        currentEducation: profileRes.data.currentEducation || '',
        institution: profileRes.data.institution || '',
        graduationYear: profileRes.data.graduationYear || ''
      });

      const statsRes = await api.get('/student/dashboard-stats');
      setStats(statsRes.data);

      const jobRecsRes = await api.get('/student/recommendations/jobs');
      setRecommendedJobs(jobRecsRes.data);

      const appsRes = await api.get('/student/applications');
      setApplications(appsRes.data);

      const sessionsRes = await api.get('/student/sessions');
      setSessions(sessionsRes.data);

      const availSessionsRes = await api.get('/student/sessions/available');
      setAvailableSessions(availSessionsRes.data);

      const coursesRes = await api.get('/courses');
      setCourses(coursesRes.data);

      // Load Quizzes
      const quizzesRes = await api.get('/student/quizzes');
      setAvailableQuizzes(quizzesRes.data);

      const attemptsRes = await api.get('/student/results');
      setAttemptsHistory(attemptsRes.data);

      const analyticsRes = await api.get('/student/performance-analytics');
      setStudentPerformance(analyticsRes.data);

      setLoading(false);
    } catch (err) {
      console.error(err);
      addToast('Failed to load portfolio stats directory.', 'error');
      setLoading(false);
    }
  };

  const reloadStudentAssessments = async () => {
    try {
      setQuizzesLoading(true);
      const quizzesRes = await api.get('/student/quizzes');
      setAvailableQuizzes(quizzesRes.data);

      const attemptsRes = await api.get('/student/results');
      setAttemptsHistory(attemptsRes.data);

      const analyticsRes = await api.get('/student/performance-analytics');
      setStudentPerformance(analyticsRes.data);

      setQuizzesLoading(false);
    } catch (err) {
      console.error(err);
      setQuizzesLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/student/profile', editForm);
      setProfile(res.data);
      setEditMode(false);
      addToast('Profile updated successfully!', 'success');
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      addToast('Failed to save profile changes.', 'error');
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const updatedSkills = new Set([...skillsList, newSkill.trim()]);
    try {
      const res = await api.put('/student/skills', Array.from(updatedSkills));
      setProfile(res.data);
      setSkillsList(Array.from(res.data.skills));
      setNewSkill('');
      addToast(`Added "${newSkill.trim()}" to your skill set.`, 'success');
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      addToast('Failed to add skill.', 'error');
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    const updatedSkills = skillsList.filter(s => s !== skillToRemove);
    try {
      const res = await api.put('/student/skills', updatedSkills);
      setProfile(res.data);
      setSkillsList(Array.from(res.data.skills));
      addToast(`Removed "${skillToRemove}" from skills.`, 'success');
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      addToast('Failed to remove skill.', 'error');
    }
  };

  const handleBookSession = async (sessionId) => {
    try {
      await api.post(`/student/sessions/book/${sessionId}`);
      addToast('Mentorship slot booked successfully!', 'success');
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      addToast('Session booking failed.', 'error');
    }
  };

  const handleApply = async (id, type) => {
    const resumeUrl = prompt('Enter your resume document URL to apply:', 'https://drive.google.com/resume.pdf');
    if (!resumeUrl) return;

    try {
      if (type === 'job') {
        await api.post(`/student/apply/job/${id}?resumeUrl=${encodeURIComponent(resumeUrl)}`);
      } else {
        await api.post(`/student/apply/internship/${id}?resumeUrl=${encodeURIComponent(resumeUrl)}`);
      }
      addToast('Application submitted successfully!', 'success');
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      addToast('Application submission failed.', 'error');
    }
  };

  const handleGenerateGapReport = async () => {
    if (!selectedPositionId) return;
    try {
      setGapLoading(true);
      const res = await api.get(`/student/gap-report?positionId=${selectedPositionId}&isInternship=${isInternship}`);
      setGapReport(res.data);
      setGapLoading(false);
    } catch (err) {
      console.error(err);
      addToast('Skill Gap Diagnostic failed.', 'error');
      setGapLoading(false);
    }
  };

  // Course Redirection & Analytics Clicks Track
  const handleVisitCourse = async (course) => {
    const { link, id, title } = course;
    if (!link || !link.trim()) {
      addToast(`Unable to redirect. Platform link is missing for: "${title}"`, 'error');
      return;
    }

    let finalUrl = link.trim();

    // Seed mock localhost fallback
    if (finalUrl.includes('localhost:3000/courses/1')) {
      finalUrl = 'https://spring.io/projects/spring-boot';
    } else if (finalUrl.includes('localhost:3000/courses/2')) {
      finalUrl = 'https://react.dev';
    } else if (finalUrl.includes('localhost:3000/courses/3')) {
      finalUrl = 'https://www.udemy.com';
    }

    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`;
    }

    try {
      new URL(finalUrl);
    } catch (e) {
      addToast(`Invalid syllabus link format: "${link}"`, 'error');
      return;
    }

    try {
      await api.post(`/courses/${id}/click`);
      setCourses(prev => prev.map(c => c.id === id ? { ...c, clickCount: (c.clickCount || 0) + 1 } : c));
    } catch (err) {
      console.error('Failed to log course click:', err);
    }

    window.open(finalUrl, '_blank', 'noopener,noreferrer');
    addToast('Redirecting to platform link...', 'success');
  };

  // Quiz Attempt Flow Operations
  const handleStartQuiz = async (quiz) => {
    // Check if student has already passed this quiz to avoid repeated success attempts
    const previousPassed = attemptsHistory.some(a => a.quizId === quiz.id && a.resultStatus === 'PASSED');
    if (previousPassed) {
      addToast('You have already completed this assessment successfully!', 'success');
    }

    try {
      setQuizzesLoading(true);
      const res = await api.get(`/student/quizzes/${quiz.id}`);
      setQuizDetails(res.data);
      setActiveQuizForAttempt(quiz);
      setAttemptStep('instructions');
      setSelectedAnswers({});
      setCurrentQuestionIndex(0);
      setQuizzesLoading(false);
    } catch (err) {
      console.error(err);
      addToast('Failed to retrieve quiz details.', 'error');
      setQuizzesLoading(false);
    }
  };

  const handleBeginExam = () => {
    setAttemptStep('exam');
    setTimeLeft((quizDetails.timeLimit || 15) * 60); // convert minutes to seconds
  };

  const handleOptionSelect = (questionId, optionId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const triggerQuizSubmission = async () => {
    try {
      setQuizzesLoading(true);
      const payload = {
        answers: selectedAnswers
      };
      const res = await api.post(`/student/quizzes/${quizDetails.id}/submit`, payload);
      setActiveAttemptResult(res.data);
      setAttemptStep('result');
      addToast('Assessment submitted successfully. Generating instant report card.', 'success');
      await reloadStudentAssessments();
    } catch (err) {
      console.error(err);
      addToast('Assessment submission failed.', 'error');
      setQuizzesLoading(false);
    }
  };

  const handleOpenReviewAttempt = async (attemptId) => {
    try {
      setQuizzesLoading(true);
      const res = await api.get(`/student/results/${attemptId}`);
      setSelectedReviewAttempt(res.data);
      setAttemptStep('review');
      setQuizzesLoading(false);
    } catch (err) {
      console.error(err);
      addToast('Failed to load review sheet.', 'error');
      setQuizzesLoading(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Quiz filters
  const filteredQuizzes = availableQuizzes.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(quizzesSearch.toLowerCase()) || 
                          q.category.toLowerCase().includes(quizzesSearch.toLowerCase());
    const matchesCategory = quizzesCategoryFilter === 'All' || q.category === quizzesCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Student Hub...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ position: 'relative' }}>
      
      {/* Toast Notifications container */}
      <div style={{ position: 'fixed', top: '25px', right: '25px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {toasts.map(t => (
          <div key={t.id} className="card p-3 shadow-lg border animate-toast" style={{
            background: '#ffffff',
            borderColor: t.type === 'error' ? '#fecaca' : '#d1fae5',
            color: t.type === 'error' ? '#dc2626' : '#059669',
            minWidth: '320px',
            borderRadius: '12px',
            fontSize: '0.92rem',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)'
          }}>
            {t.type === 'error' ? <FiXCircle size={20} /> : <FiCheckCircle size={20} />}
            <div className="fw-semibold">{t.message}</div>
          </div>
        ))}
      </div>

      {/* Header and navigation tabs */}
      <div className="row mb-4 align-items-center">
        <div className="col-md-8">
          <h1 className="fw-bold text-gradient-primary">Hello, {profile?.firstName}!</h1>
          <p className="text-muted fs-5">Track your learning paths, schedule mentorship, and browse matching roles.</p>
        </div>
        <div className="col-md-4 text-md-end">
          <button className="btn btn-premium-primary" onClick={() => setEditMode(!editMode)}>
            {editMode ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {editMode && (
        <div className="card glass-card p-4 mb-5 shadow-lg border border-primary border-opacity-20">
          <h4 className="fw-bold text-gradient-primary mb-3">Update Profile Info</h4>
          <form onSubmit={handleUpdateProfile}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted">First Name</label>
                <input
                  type="text"
                  className="form-control form-premium"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted">Last Name</label>
                <input
                  type="text"
                  className="form-control form-premium"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted">Phone</label>
                <input
                  type="text"
                  className="form-control form-premium"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted">Education Degree</label>
                <input
                  type="text"
                  className="form-control form-premium"
                  value={editForm.currentEducation}
                  onChange={(e) => setEditForm({ ...editForm, currentEducation: e.target.value })}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8 mb-3">
                <label className="form-label text-muted">Institution</label>
                <input
                  type="text"
                  className="form-control form-premium"
                  value={editForm.institution}
                  onChange={(e) => setEditForm({ ...editForm, institution: e.target.value })}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label text-muted">Graduation Year</label>
                <input
                  type="number"
                  className="form-control form-premium"
                  value={editForm.graduationYear}
                  onChange={(e) => setEditForm({ ...editForm, graduationYear: e.target.value })}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label text-muted">Bio</label>
              <textarea
                className="form-control form-premium"
                rows="3"
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-premium-primary">Save Changes</button>
          </form>
        </div>
      )}

      {/* Tabs configuration header */}
      <div className="d-flex gap-2 mb-4 border-bottom border-light pb-2">
        <button 
          className={`btn btn-sm py-2 px-3 fw-bold border-0 ${activeTab === 'portfolio' ? 'text-primary border-bottom border-primary border-3' : 'text-muted'}`}
          onClick={() => {
            setActiveTab('portfolio');
            setActiveQuizForAttempt(null);
          }}
          style={{ background: 'transparent', borderRadius: '0' }}
        >
          <FiUser className="me-1" /> Student Portfolio &amp; Roster
        </button>
        <button 
          className={`btn btn-sm py-2 px-3 fw-bold border-0 ${activeTab === 'assessments' ? 'text-primary border-bottom border-primary border-3' : 'text-muted'}`}
          onClick={() => {
            setActiveTab('assessments');
            setActiveQuizForAttempt(null);
          }}
          style={{ background: 'transparent', borderRadius: '0' }}
        >
          <FiAward className="me-1" /> My MCQ Assessments
        </button>
      </div>

      {/* Student Portfolio Workspace */}
      {activeTab === 'portfolio' && (
        <>
          {/* Stats Counter Row */}
          <div className="row g-4 mb-5">
            <div className="col-md-3">
              <div className="card glass-card stat-box shadow-sm">
                <FiAward className="stat-icon text-gradient-primary" />
                <div className="stat-number text-gradient-primary">{stats?.skillsCount || 0}</div>
                <div className="stat-label">My Skills</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card glass-card stat-box shadow-sm">
                <FiBriefcase className="stat-icon" style={{ color: 'var(--secondary)' }} />
                <div className="stat-number text-gradient-secondary">{stats?.appliedCount || 0}</div>
                <div className="stat-label">Applications</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card glass-card stat-box shadow-sm">
                <FiTrendingUp className="stat-icon" style={{ color: 'var(--accent)' }} />
                <div className="stat-number" style={{ color: 'var(--accent)' }}>{stats?.recommendedCount || 0}</div>
                <div className="stat-label">Job Matches</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card glass-card stat-box shadow-sm">
                <FiCalendar className="stat-icon" style={{ color: '#fbbf24' }} />
                <div className="stat-number" style={{ color: '#fbbf24' }}>{stats?.sessionsCount || 0}</div>
                <div className="stat-label">Mentor Sessions</div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Left column: Skills Management & Gap report */}
            <div className="col-lg-5">
              <div className="card glass-card p-4 mb-4 shadow-sm">
                <h4 className="fw-bold mb-3 d-flex align-items-center text-gradient-primary">
                  <FiAward className="me-2 text-indigo" />
                  Manage Skills
                </h4>
                <form onSubmit={handleAddSkill} className="d-flex mb-3">
                  <input
                    type="text"
                    className="form-control form-premium me-2"
                    placeholder="Add skill (e.g. Java, ReactJS)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                  />
                  <button type="submit" className="btn btn-premium-primary d-flex align-items-center">
                    <FiPlusCircle className="me-1" /> Add
                  </button>
                </form>
                <div className="d-flex flex-wrap gap-2">
                  {skillsList.length === 0 ? (
                    <span className="text-muted small">No skills added yet. Add skills to match jobs!</span>
                  ) : (
                    skillsList.map((skill) => (
                      <span key={skill} className="badge-premium d-flex align-items-center">
                        {skill}
                        <FiXCircle
                          className="ms-2 cursor-pointer text-danger"
                          onClick={() => handleRemoveSkill(skill)}
                          style={{ cursor: 'pointer' }}
                        />
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="card glass-card p-4 shadow-sm">
                <h4 className="fw-bold mb-3 d-flex align-items-center text-gradient-secondary">
                  <FiTrendingUp className="me-2 text-pink" />
                  Skill Gap Analysis
                </h4>
                <div className="mb-3">
                  <label className="form-label text-muted">Select Job Post to Analyze</label>
                  <select 
                    className="form-select form-premium" 
                    value={selectedPositionId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedPositionId(val);
                      const matched = recommendedJobs.find(item => (item.jobId || item.internshipId).toString() === val);
                      if (matched) {
                        setIsInternship(matched.internship);
                      }
                    }}
                  >
                    <option value="">-- Choose Position --</option>
                    {recommendedJobs.map(item => (
                      <option key={item.jobId || item.internshipId} value={item.jobId || item.internshipId}>
                        {item.title} ({item.companyName}) [{item.internship ? 'Internship' : 'Job'}]
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3 form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isInternshipCheck"
                    checked={isInternship}
                    disabled
                  />
                  <label className="form-check-label text-muted" htmlFor="isInternshipCheck">Is this an Internship? (Auto-detected)</label>
                </div>
                <button 
                  className="btn btn-premium-secondary w-100" 
                  onClick={handleGenerateGapReport}
                  disabled={!selectedPositionId || gapLoading}
                >
                  {gapLoading ? 'Analyzing...' : 'Generate Skill Gap Report'}
                </button>

                {gapReport && (
                  <div className="mt-4 p-3 rounded bg-light border border-light animate-fade-in">
                    <h5 className="fw-bold text-gradient-primary mb-2">{gapReport.title} Gap Analysis</h5>
                    <p className="small text-muted mb-3">{gapReport.companyName}</p>
                    
                    <div className="mb-2">
                      <strong className="text-dark small">Matching Skills:</strong>
                      <div className="d-flex flex-wrap gap-1 mt-1">
                        {gapReport.matchingSkills.length === 0 ? <span className="text-muted small">None</span> : 
                          gapReport.matchingSkills.map(s => <span key={s} className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-10 small">{s}</span>)
                        }
                      </div>
                    </div>

                    <div className="mb-3">
                      <strong className="text-dark small">Missing Skills:</strong>
                      <div className="d-flex flex-wrap gap-1 mt-1">
                        {gapReport.missingSkills.length === 0 ? <span className="text-success small fw-semibold">Perfect Match!</span> : 
                          gapReport.missingSkills.map(s => <span key={s} className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-10 small">{s}</span>)
                        }
                      </div>
                    </div>

                    {gapReport.missingSkills.length > 0 && (
                      <div className="pt-2 border-top border-light">
                        <strong className="text-gradient-secondary small fw-bold">Recommended Courses:</strong>
                        <ul className="list-unstyled mt-2 mb-0">
                          {gapReport.recommendedCourses.length === 0 ? (
                            <li className="text-muted small">No specific courses found for these tags.</li>
                          ) : (
                            gapReport.recommendedCourses.map(course => (
                              <li key={course.id} className="mb-2 p-2 rounded bg-white border border-light shadow-sm">
                                <div className="d-flex justify-content-between align-items-center">
                                  <span className="fw-bold text-dark small text-truncate me-2">{course.title}</span>
                                  <button onClick={() => handleVisitCourse(course)} className="btn btn-sm btn-premium-primary py-1 px-3 small flex-shrink-0" style={{ fontSize: '0.75rem' }}>Start</button>
                                </div>
                                <div className="text-muted small mt-1" style={{ fontSize: '0.75rem' }}>{course.platform} &bull; Instructor: {course.instructor}</div>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right column: Jobs & Courses matching */}
            <div className="col-lg-7">
              {/* Job Recommendation listings */}
              <div className="card glass-card p-4 mb-4 shadow-sm">
                <h4 className="fw-bold mb-3 d-flex align-items-center text-gradient-primary">
                  <FiBriefcase className="me-2" />
                  Recommended Roles &amp; Internships
                </h4>
                {recommendedJobs.length === 0 ? (
                  <p className="text-muted small py-4 text-center border border-dashed rounded">Add more skills to get personalized job suggestions.</p>
                ) : (
                  <div className="list-group list-group-flush bg-transparent">
                    {recommendedJobs.map(item => (
                      <div key={item.jobId || item.internshipId} className="list-group-item bg-transparent text-dark border-bottom border-light px-0 py-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h5 className="fw-bold mb-1 text-gradient-primary">
                              {item.title}
                              <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-10 ms-2 small" style={{ fontSize: '0.7rem' }}>
                                {item.internship ? 'Internship' : 'Full-time'}
                              </span>
                            </h5>
                            <p className="mb-2 text-muted small">{item.companyName} &bull; {item.location}</p>
                            <div className="d-flex flex-wrap gap-1">
                              {Array.from(item.requiredSkills || []).map(skill => (
                                <span key={skill} className="badge bg-light text-muted border border-light small">{skill}</span>
                              ))}
                            </div>
                          </div>
                          <div className="text-end flex-shrink-0 ms-2">
                            <span className="badge-premium-accent mb-2 d-inline-block">{item.matchPercentage}% Match</span>
                            <div>
                              <button 
                                className="btn btn-sm btn-premium-primary"
                                onClick={() => handleApply(item.jobId || item.internshipId, item.internship ? 'internship' : 'job')}
                              >
                                Apply
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Courses catalog */}
              <div className="card glass-card p-4 mb-4 shadow-sm">
                <h4 className="fw-bold mb-3 d-flex align-items-center text-gradient-secondary">
                  <FiBookOpen className="me-2 text-pink" />
                  Recommended Training Programs
                </h4>
                <div className="row g-3">
                  {courses.length === 0 ? (
                    <p className="text-muted small col-12 py-4 text-center border border-dashed rounded">No courses recommended. Adjust skills to discover courses.</p>
                  ) : (
                    courses.map(course => (
                      <div className="col-md-6 animate-card-appear" key={course.id}>
                        <div className="card h-100 bg-white border border-light hover-premium-card p-3 d-flex flex-column" style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', borderRadius: '14px' }}>
                          <div className="d-flex align-items-center gap-3 mb-2">
                            {getCourseIcon(course.tags)}
                            <div style={{ minWidth: 0 }}>
                              <h6 className="fw-bold text-gradient-primary mb-0 text-truncate" style={{ cursor: 'pointer' }} onClick={() => handleVisitCourse(course)} title="Visit course link">
                                {course.title}
                              </h6>
                              <span className="text-muted small" style={{ fontSize: '0.75rem' }}>By {course.instructor}</span>
                            </div>
                          </div>

                          <div className="mb-2 d-flex flex-wrap gap-1">
                            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 small" style={{ fontSize: '0.65rem' }}>
                              {course.difficultyLevel}
                            </span>
                            <span className="badge bg-light text-secondary border border-light small" style={{ fontSize: '0.65rem' }}>
                              {course.platform}
                            </span>
                          </div>

                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="text-warning small d-flex align-items-center gap-1" style={{ fontSize: '0.8rem' }}>
                              <FiStar fill="currentColor" size={12} />
                              <span className="fw-bold text-dark">{course.rating ? course.rating.toFixed(1) : '4.5'}</span>
                            </div>
                            <span className="text-muted small" style={{ fontSize: '0.7rem' }}>Views: {course.clickCount || 0}</span>
                          </div>

                          <p className="text-muted small flex-grow-1 text-truncate" style={{ fontSize: '0.8rem' }}>
                            {course.description}
                          </p>

                          <div className="mt-auto d-flex justify-content-between align-items-center pt-2 border-top border-light">
                            <button 
                              onClick={() => handleVisitCourse(course)} 
                              className="btn btn-sm btn-premium-primary py-1 px-3 d-inline-flex align-items-center justify-content-center"
                            >
                              <FiExternalLink className="me-1" /> Enroll Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Applications tracker table */}
              <div className="card glass-card p-4 mb-4 shadow-sm">
                <h4 className="fw-bold mb-3 d-flex align-items-center text-gradient-primary">
                  <FiFileText className="me-2" />
                  Application Tracker
                </h4>
                {applications.length === 0 ? (
                  <p className="text-muted small py-4 text-center border border-dashed rounded">You have not applied for any roles yet.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0" style={{ color: 'var(--text-main)' }}>
                      <thead style={{ background: 'var(--bg-glass-hover)', borderBottom: '1.5px solid var(--border-color)' }}>
                        <tr className="text-muted small fw-bold">
                          <th>Company</th>
                          <th>Title</th>
                          <th>Applied Date</th>
                          <th>Status</th>
                          <th>Feedback</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map(app => (
                          <tr key={app.id} className="border-bottom border-light">
                            <td className="fw-semibold text-dark">{app.companyName}</td>
                            <td className="small">{app.jobTitle || app.internshipTitle || 'Position'}</td>
                            <td className="small text-muted">{app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'N/A'}</td>
                            <td>
                              <span className={`badge ${
                                app.status === 'SHORTLISTED' || app.status === 'APPROVED' ? 'bg-success bg-opacity-10 text-success' :
                                app.status === 'REJECTED' ? 'bg-danger bg-opacity-10 text-danger' :
                                'bg-warning bg-opacity-10 text-warning'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="small text-muted">{app.feedback || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Mentorship sessions slots */}
              <div className="card glass-card p-4 shadow-sm">
                <h4 className="fw-bold mb-3 d-flex align-items-center text-gradient-secondary">
                  <FiCalendar className="me-2" />
                  Mentorship &amp; Study Sessions
                </h4>
                <div className="row g-3 mb-4">
                  <h5 className="text-dark fw-bold mb-2 small text-uppercase">Your Booked Sessions</h5>
                  {sessions.length === 0 ? <p className="text-muted small col-12">No booked sessions.</p> : 
                    sessions.map(s => (
                      <div key={s.id} className="col-md-6" style={{ minWidth: '240px' }}>
                        <div className="p-3 rounded bg-success bg-opacity-5 border border-success border-opacity-10">
                          <div className="fw-bold text-dark mb-1">{s.title}</div>
                          <div className="small text-muted mb-2">Mentor: {s.mentorName || s.mentorId} &bull; {s.durationMinutes} min</div>
                          <div className="small text-muted mb-3">Time: {new Date(s.dateTime).toLocaleString()}</div>
                          {s.meetingLink && <a href={s.meetingLink} target="_blank" rel="noreferrer" className="btn btn-sm btn-premium-primary w-100 py-1">Join Meeting</a>}
                        </div>
                      </div>
                    ))
                  }
                </div>

                <div className="row g-3">
                  <h5 className="text-dark fw-bold mb-2 small text-uppercase">Available Mentor Slots</h5>
                  {availableSessions.length === 0 ? <p className="text-muted small col-12">No available sessions right now.</p> : 
                    availableSessions.map(s => (
                      <div key={s.id} className="col-md-6" style={{ minWidth: '240px' }}>
                        <div className="p-3 rounded bg-light border border-light shadow-xs">
                          <div className="fw-bold text-dark mb-1">{s.title}</div>
                          <div className="small text-muted mb-2">Mentor ID: {s.mentorId} &bull; {s.durationMinutes} min</div>
                          <div className="small text-muted mb-3">Time: {new Date(s.dateTime).toLocaleString()}</div>
                          <button className="btn btn-sm btn-premium-secondary w-100 py-1" onClick={() => handleBookSession(s.id)}>Book Slot</button>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Student MCQs Quiz Assessments Workspace */}
      {activeTab === 'assessments' && (
        <div className="animate-fade-in">
          
          {activeQuizForAttempt === null ? (
            <>
              {/* Performance Analytics Header */}
              {studentPerformance && (
                <div className="row g-4 mb-5">
                  <div className="col-md-3">
                    <div className="card glass-card stat-box shadow-sm">
                      <FiCheckCircle className="stat-icon text-success" />
                      <div className="stat-number text-success">{studentPerformance.totalAttempts}</div>
                      <div className="stat-label">Quizzes Attempted</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card glass-card stat-box shadow-sm">
                      <FiTrendingUp className="stat-icon" style={{ color: 'var(--secondary)' }} />
                      <div className="stat-number text-gradient-secondary">{studentPerformance.averageScore}%</div>
                      <div className="stat-label">Average Score</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card glass-card p-3 shadow-sm h-100 d-flex flex-column justify-content-center">
                      <div className="fw-bold text-dark mb-2 small text-uppercase">Skill-Wise Proficiency</div>
                      {studentPerformance.skillWisePerformance.length === 0 ? (
                        <div className="text-muted small">No category stats logged. Attempt assessments below.</div>
                      ) : (
                        <div className="d-flex flex-wrap gap-2">
                          {studentPerformance.skillWisePerformance.map((item, idx) => (
                            <div key={idx} className="p-2 rounded border border-light bg-light d-flex align-items-center gap-2 small">
                              <strong className="text-dark">{item.skill}:</strong>
                              <span className="text-primary fw-bold">{item.average}%</span>
                              <span className="text-success small fw-semibold">({item.progress})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Assessment Catalogs Grid */}
              <div className="card glass-card p-4 mb-4 shadow-sm">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                  <div>
                    <h4 className="fw-bold mb-1 d-flex align-items-center text-gradient-primary">
                      <FiAward className="me-2 text-indigo" />
                      Available Quiz Assessments
                    </h4>
                    <p className="text-muted small mb-0">Evaluate your coding and interview readiness. Instant grading and reviews provided.</p>
                  </div>
                  <div className="d-flex gap-2">
                    <div className="input-group input-group-sm" style={{ width: '220px' }}>
                      <span className="input-group-text bg-white border-end-0 text-muted"><FiSearch /></span>
                      <input
                        type="text"
                        className="form-control form-premium ps-1 border-start-0"
                        placeholder="Search quizzes..."
                        value={quizzesSearch}
                        onChange={(e) => setQuizzesSearch(e.target.value)}
                      />
                    </div>
                    <select
                      className="form-select form-select-sm form-premium py-1"
                      style={{ width: '130px' }}
                      value={quizzesCategoryFilter}
                      onChange={(e) => setQuizzesCategoryFilter(e.target.value)}
                    >
                      <option value="All">All Skills</option>
                      <option value="Java">Java</option>
                      <option value="ReactJS">ReactJS</option>
                      <option value="Spring Boot">Spring Boot</option>
                      <option value="MySQL">MySQL</option>
                      <option value="Data Structures">Data Structures</option>
                      <option value="Aptitude">Aptitude</option>
                      <option value="Interview Preparation">Interview Prep</option>
                    </select>
                  </div>
                </div>

                {quizzesLoading ? (
                  <div className="text-center py-4"><span className="spinner-border text-primary" role="status"></span></div>
                ) : filteredQuizzes.length === 0 ? (
                  <div className="text-center py-5 border border-dashed rounded">
                    <FiBook size={30} className="text-muted mb-2" />
                    <h6 className="text-secondary fw-semibold">No active assessments found.</h6>
                    <p className="text-muted small">Mentors publish active assessments on a rolling schedule.</p>
                  </div>
                ) : (
                  <div className="row g-3">
                    {filteredQuizzes.map(quiz => {
                      const completed = attemptsHistory.some(a => a.quizId === quiz.id && a.resultStatus === 'PASSED');
                      return (
                        <div className="col-md-6" key={quiz.id}>
                          <div className="card h-100 p-3 bg-white border border-light hover-premium-card d-flex flex-column shadow-xs" style={{ borderRadius: '12px' }}>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 small">{quiz.category}</span>
                              <span className="badge bg-light text-muted small">{quiz.difficulty}</span>
                            </div>
                            <h5 className="fw-bold mb-1 text-gradient-primary">{quiz.title}</h5>
                            <p className="text-muted small flex-grow-1 text-truncate-2 mb-3" style={{ fontSize: '0.85rem' }}>{quiz.description}</p>
                            
                            <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light mt-auto">
                              <span className="text-muted small d-inline-flex align-items-center gap-1">
                                <FiClock /> {quiz.timeLimit} Minutes
                              </span>
                              {completed ? (
                                <div className="d-flex align-items-center gap-2">
                                  <span className="text-success small fw-bold">Passed ✓</span>
                                  <button className="btn btn-sm btn-premium-primary" onClick={() => handleStartQuiz(quiz)}>Re-take</button>
                                </div>
                              ) : (
                                <button className="btn btn-sm btn-premium-primary" onClick={() => handleStartQuiz(quiz)}>Start Quiz</button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quiz attempt history tracker */}
              <div className="card glass-card p-4 shadow-sm">
                <h4 className="fw-bold mb-3 d-flex align-items-center text-gradient-secondary">
                  <FiList className="me-2 text-pink" />
                  Attempt History &amp; Result Sheets
                </h4>

                {attemptsHistory.length === 0 ? (
                  <p className="text-muted small py-4 text-center border border-dashed rounded">No assessment logs found. Submit an exam to display tracker sheets.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0" style={{ color: 'var(--text-main)' }}>
                      <thead style={{ background: 'var(--bg-glass-hover)', borderBottom: '1.5px solid var(--border-color)' }}>
                        <tr className="text-muted small fw-bold">
                          <th>Quiz Title</th>
                          <th>Category</th>
                          <th>Date Submitted</th>
                          <th>Percentage</th>
                          <th>Marks Scored</th>
                          <th>Status</th>
                          <th className="text-end">Review</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attemptsHistory.map(att => (
                          <tr key={att.id} className="border-bottom border-light">
                            <td className="fw-bold text-dark">{att.quizTitle}</td>
                            <td>{att.quizCategory}</td>
                            <td className="small text-muted">{new Date(att.completedTime).toLocaleDateString()}</td>
                            <td className="fw-bold text-dark">{att.percentage ? att.percentage.toFixed(0) : '0'}%</td>
                            <td className="small">{att.score} Marks</td>
                            <td>
                              <span className={`badge ${att.resultStatus === 'PASSED' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'} small`}>
                                {att.resultStatus}
                              </span>
                            </td>
                            <td className="text-end">
                              <button 
                                className="btn btn-sm btn-outline-info d-inline-flex align-items-center py-1 px-2"
                                onClick={() => handleOpenReviewAttempt(att.id)}
                              >
                                <FiEye className="me-1" /> Review Sheet
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Quiz underway workspace (Instructions / Exam / Result / Review steps)
            <div className="row g-4 animate-fade-in">
              <div className="col-lg-12">
                
                {/* 1. Instructions Panel */}
                {attemptStep === 'instructions' && quizDetails && (
                  <div className="card glass-card p-4 mx-auto shadow-lg border border-primary border-opacity-25" style={{ maxWidth: '600px' }}>
                    <div className="text-center mb-4">
                      <FiBookOpen size={45} className="text-primary mb-2" />
                      <h3 className="fw-bold text-gradient-primary mb-1">{quizDetails.title}</h3>
                      <span className="badge bg-light text-muted small">{quizDetails.category} &bull; {quizDetails.difficulty}</span>
                    </div>

                    <div className="p-3 bg-light rounded mb-4 border border-light">
                      <h6 className="fw-bold text-dark mb-2">Instructions &amp; Exam Policy:</h6>
                      <ul className="small text-muted ps-3 mb-0" style={{ lineHeight: '1.6' }}>
                        <li><strong>Time Limit:</strong> You have exactly {quizDetails.timeLimit} minutes to submit answers.</li>
                        <li><strong>Grading threshold:</strong> Achieving {quizDetails.passingPercentage}% marks is required to receive a PASSED rank.</li>
                        <li><strong>Behavior:</strong> Leaving the active browser page or tab during evaluation does not halt the running countdown clock.</li>
                        <li><strong>Submit:</strong> Click submit when finished to view explanations and grading reports instantly.</li>
                      </ul>
                    </div>

                    <div className="d-flex gap-2">
                      <button className="btn btn-premium-primary flex-grow-1" onClick={handleBeginExam}>
                        <FiPlay className="me-1" /> Begin Assessment
                      </button>
                      <button className="btn btn-premium-outline" onClick={() => setActiveQuizForAttempt(null)}>Cancel</button>
                    </div>
                  </div>
                )}

                {/* 2. Ongoing Exam Console */}
                {attemptStep === 'exam' && quizDetails && quizDetails.questions && quizDetails.questions.length > 0 && (
                  <div className="card glass-card p-4 shadow-lg border border-primary border-opacity-25">
                    {/* Header metrics & running countdown timer */}
                    <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-light">
                      <div>
                        <h4 className="fw-bold text-gradient-primary mb-0">{quizDetails.title}</h4>
                        <span className="text-muted small">Question {currentQuestionIndex + 1} of {quizDetails.questions.length}</span>
                      </div>
                      <div className="p-2 bg-danger bg-opacity-5 rounded border border-danger border-opacity-15 text-danger fw-bold d-flex align-items-center gap-2">
                        <FiClock />
                        <span style={{ fontSize: '1.1rem' }}>{formatTimer(timeLeft)}</span>
                      </div>
                    </div>

                    {/* Question text */}
                    <div className="mb-4">
                      <h5 className="fw-bold text-dark mb-2">
                        Q{currentQuestionIndex + 1}. {quizDetails.questions[currentQuestionIndex].questionText}
                      </h5>
                      <span className="text-muted small">Weightage: {quizDetails.questions[currentQuestionIndex].marks || 1} Mark(s)</span>
                    </div>

                    {/* Options list */}
                    <div className="d-flex flex-column gap-3 mb-5">
                      {quizDetails.questions[currentQuestionIndex].options && 
                       quizDetails.questions[currentQuestionIndex].options.map((opt, oIdx) => {
                         const letters = ['A', 'B', 'C', 'D'];
                         const isSelected = selectedAnswers[quizDetails.questions[currentQuestionIndex].id] === opt.id;
                         return (
                           <div 
                             key={opt.id} 
                             className={`card p-3 border cursor-pointer hover-scale select-option-row ${isSelected ? 'border-primary bg-primary bg-opacity-5 text-primary fw-semibold shadow-xs' : 'border-light bg-white text-muted'}`}
                             onClick={() => handleOptionSelect(quizDetails.questions[currentQuestionIndex].id, opt.id)}
                             style={{ cursor: 'pointer', borderRadius: '12px', transition: 'all 0.2s' }}
                           >
                             <div className="d-flex align-items-center gap-3">
                               <div className={`p-1 px-2 rounded-circle small ${isSelected ? 'bg-primary text-white' : 'bg-light text-muted border'}`}>
                                 {letters[oIdx]}
                               </div>
                               <div>{opt.optionText}</div>
                             </div>
                           </div>
                         );
                      })}
                    </div>

                    {/* Footer page controls */}
                    <div className="d-flex justify-content-between align-items-center pt-3 border-top border-light">
                      <button 
                        className="btn btn-premium-outline px-4"
                        disabled={currentQuestionIndex === 0}
                        onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                      >
                        Previous
                      </button>
                      
                      {currentQuestionIndex < quizDetails.questions.length - 1 ? (
                        <button 
                          className="btn btn-premium-outline px-4"
                          onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                        >
                          Next Question
                        </button>
                      ) : (
                        <button 
                          className="btn btn-premium-primary px-4"
                          onClick={triggerQuizSubmission}
                        >
                          Submit Assessment
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Instant Result Page */}
                {attemptStep === 'result' && activeAttemptResult && (
                  <div className="card glass-card p-4 mx-auto shadow-lg border border-light text-center animate-slide-up" style={{ maxWidth: '550px' }}>
                    <div className="mb-4">
                      {activeAttemptResult.resultStatus === 'PASSED' ? (
                        <>
                          <FiCheckCircle size={55} className="text-success mb-2" />
                          <h2 className="fw-bold text-success">Passed ✓</h2>
                        </>
                      ) : (
                        <>
                          <FiXCircle size={55} className="text-danger mb-2" />
                          <h2 className="fw-bold text-danger">Failed ✗</h2>
                        </>
                      )}
                      <p className="text-muted small">Grading results generated instantly</p>
                    </div>

                    <div className="p-3 bg-light border border-light rounded mb-4 text-start">
                      <h6 className="fw-bold text-dark border-bottom border-light pb-2 mb-3">Quiz: {activeAttemptResult.quizTitle}</h6>
                      <div className="row g-2 text-muted small">
                        <div className="col-6"><strong>Student:</strong> {activeAttemptResult.studentName}</div>
                        <div className="col-6"><strong>Marks Scored:</strong> {activeAttemptResult.score}</div>
                        <div className="col-6"><strong>Percentage:</strong> {activeAttemptResult.percentage.toFixed(0)}%</div>
                        <div className="col-6"><strong>Passing Margin:</strong> {quizDetails.passingPercentage}%</div>
                        <div className="col-6"><strong>Date Taken:</strong> {new Date(activeAttemptResult.completedTime).toLocaleDateString()}</div>
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-premium-primary flex-grow-1"
                        onClick={() => handleOpenReviewAttempt(activeAttemptResult.id)}
                      >
                        Review Explanation Sheet
                      </button>
                      <button 
                        className="btn btn-premium-outline"
                        onClick={() => {
                          setActiveQuizForAttempt(null);
                          reloadStudentAssessments();
                        }}
                      >
                        Exit to Catalog
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. MCQ Review Explanation Sheet */}
                {attemptStep === 'review' && selectedReviewAttempt && (
                  <div className="card glass-card p-4 shadow-lg border border-light animate-fade-in">
                    <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-light">
                      <div>
                        <h4 className="fw-bold text-gradient-primary mb-1">Answer Review Sheet</h4>
                        <span className="badge bg-light text-muted small">{selectedReviewAttempt.quizTitle} &bull; Score: {selectedReviewAttempt.percentage.toFixed(0)}%</span>
                      </div>
                      <button 
                        className="btn btn-sm btn-premium-outline"
                        onClick={() => {
                          setActiveQuizForAttempt(null);
                          setSelectedReviewAttempt(null);
                          reloadStudentAssessments();
                        }}
                      >
                        Exit Review Console
                      </button>
                    </div>

                    {/* Question review cards list */}
                    <div className="d-flex flex-column gap-4">
                      {selectedReviewAttempt.studentAnswers && 
                       selectedReviewAttempt.studentAnswers.map((ans, idx) => (
                         <div key={ans.id} className="p-3 border border-light rounded bg-light">
                           <div className="d-flex justify-content-between align-items-start mb-2">
                             <h6 className="fw-bold text-dark mb-1">
                               Question {idx + 1}: {ans.questionText}
                             </h6>
                             <span className={`badge ${ans.isCorrect ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'} small flex-shrink-0 ms-2`}>
                               {ans.isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                             </span>
                           </div>

                           <div className="row g-2 text-muted small mb-2">
                             <div className="col-12">
                               Your Choice: <strong className={ans.isCorrect ? 'text-success' : 'text-danger'}>{ans.selectedOptionText}</strong>
                             </div>
                             {!ans.isCorrect && (
                               <div className="col-12">
                                 Correct Answer: <strong className="text-success">{ans.correctOptionText}</strong>
                               </div>
                             )}
                           </div>

                           {ans.explanation && (
                             <div className="text-muted small p-2 bg-white rounded border border-light mt-1" style={{ fontSize: '0.82rem' }}>
                               <strong>Explanation:</strong> {ans.explanation}
                             </div>
                           )}
                         </div>
                       ))
                      }
                    </div>

                    <div className="text-end mt-4 pt-3 border-top border-light">
                      <button 
                        className="btn btn-premium-primary"
                        onClick={() => {
                          setActiveQuizForAttempt(null);
                          setSelectedReviewAttempt(null);
                          reloadStudentAssessments();
                        }}
                      >
                        Done Reviewing
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default StudentDashboard;
