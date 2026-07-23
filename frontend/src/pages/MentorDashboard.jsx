import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  FiCalendar, FiClock, FiPlusCircle, FiCheckSquare, FiAward, 
  FiUser, FiTrash2, FiEdit2, FiList, FiTrendingUp, FiEye, 
  FiCheckCircle, FiXCircle, FiSave, FiArrowLeft, FiPlus, FiBookOpen 
} from 'react-icons/fi';

const MentorDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  
  // Dashboard Tab Configuration
  const [activeTab, setActiveTab] = useState('sessions'); // sessions, quizzes, analytics

  // Mentor Sessions State
  const [sessionForm, setSessionForm] = useState({
    title: '',
    description: '',
    dateTime: '',
    durationMinutes: 45,
    meetingLink: 'https://meet.google.com/abc-defg-hij'
  });
  const [selectedSession, setSelectedSession] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

  // Assessments & Quizzes State
  const [quizzes, setQuizzes] = useState([]);
  const [quizzesLoading, setQuizzesLoading] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    category: 'Java',
    difficulty: 'Beginner',
    timeLimit: 15,
    totalMarks: 20,
    passingPercentage: 60,
    status: 'DRAFT'
  });

  // Questions Builder State
  const [activeQuizForQuestions, setActiveQuizForQuestions] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [questionForm, setQuestionForm] = useState({
    questionText: '',
    explanation: '',
    marks: 1,
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOptionIndex: 0 // 0 = A, 1 = B, 2 = C, 3 = D
  });

  // Analytics Selection State
  const [selectedQuizAnalytics, setSelectedQuizAnalytics] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);

  // Common UI State
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    fetchMentorData();
  }, []);

  const fetchMentorData = async () => {
    try {
      setLoading(true);
      const profileRes = await api.get('/mentor/profile');
      setProfile(profileRes.data);

      const statsRes = await api.get('/mentor/dashboard-stats');
      setStats(statsRes.data);

      const sessionsRes = await api.get('/mentor/sessions');
      setSessions(sessionsRes.data);

      // Load quizzes
      const quizzesRes = await api.get('/mentor/quizzes');
      setQuizzes(quizzesRes.data);

      setLoading(false);
    } catch (err) {
      console.error(err);
      addToast('Failed to retrieve mentor profile data.', 'error');
      setLoading(false);
    }
  };

  const reloadQuizzes = async () => {
    try {
      setQuizzesLoading(true);
      const res = await api.get('/mentor/quizzes');
      setQuizzes(res.data);
      setQuizzesLoading(false);
    } catch (err) {
      console.error('Quiz reload failure:', err);
      setQuizzesLoading(false);
    }
  };

  // Profile Updates
  const [editMode, setEditMode] = useState(false);
  const [editProfile, setEditProfile] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
    company: '',
    designation: '',
    expertise: ''
  });

  const triggerEditMode = () => {
    setEditProfile({
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone || '',
      bio: profile.bio || '',
      company: profile.company || '',
      designation: profile.designation || '',
      expertise: profile.expertise || ''
    });
    setEditMode(!editMode);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/mentor/profile', editProfile);
      setProfile(res.data);
      setEditMode(false);
      addToast('Profile changes saved successfully.', 'success');
      fetchMentorData();
    } catch (err) {
      console.error(err);
      addToast('Profile update failed.', 'error');
    }
  };

  // Mentorship Slots Actions
  const handleScheduleSession = async (e) => {
    e.preventDefault();
    try {
      await api.post('/mentor/sessions', sessionForm);
      addToast('Mentorship slot scheduled successfully!', 'success');
      setSessionForm({
        title: '',
        description: '',
        dateTime: '',
        durationMinutes: 45,
        meetingLink: 'https://meet.google.com/abc-defg-hij'
      });
      fetchMentorData();
    } catch (err) {
      console.error(err);
      addToast('Failed to schedule session.', 'error');
    }
  };

  const handleCompleteSession = async (e) => {
    e.preventDefault();
    if (!selectedSession) return;
    try {
      await api.post(`/mentor/sessions/complete/${selectedSession.id}?feedback=${encodeURIComponent(feedbackText)}`);
      addToast('Slot marked as completed and feedback logged.', 'success');
      setSelectedSession(null);
      setFeedbackText('');
      fetchMentorData();
    } catch (err) {
      console.error(err);
      addToast('Failed to close session.', 'error');
    }
  };

  // Quizzes CRUD Actions
  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (!quizForm.title.trim()) {
      addToast('Quiz Title is required.', 'error');
      return;
    }
    try {
      if (editingQuizId) {
        await api.put(`/mentor/quizzes/${editingQuizId}`, quizForm);
        addToast('Quiz details updated successfully.', 'success');
      } else {
        await api.post('/mentor/quizzes', quizForm);
        addToast('Quiz created! Use the Question Builder to add questions.', 'success');
      }
      setShowQuizForm(false);
      setEditingQuizId(null);
      setQuizForm({
        title: '',
        description: '',
        category: 'Java',
        difficulty: 'Beginner',
        timeLimit: 15,
        totalMarks: 20,
        passingPercentage: 60,
        status: 'DRAFT'
      });
      await reloadQuizzes();
    } catch (err) {
      console.error(err);
      addToast('Failed to save quiz details.', 'error');
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Delete this quiz assessment permanently? All questions and student score attempts will be purged.')) return;
    try {
      await api.delete(`/mentor/quizzes/${quizId}`);
      addToast('Quiz assessment deleted successfully.', 'success');
      await reloadQuizzes();
    } catch (err) {
      console.error(err);
      addToast('Quiz deletion failed.', 'error');
    }
  };

  const handleEditQuiz = (q) => {
    setEditingQuizId(q.id);
    setQuizForm({
      title: q.title,
      description: q.description || '',
      category: q.category,
      difficulty: q.difficulty,
      timeLimit: q.timeLimit,
      totalMarks: q.totalMarks,
      passingPercentage: q.passingPercentage,
      status: q.status
    });
    setShowQuizForm(true);
  };

  const handleToggleQuizPublish = async (q) => {
    const nextStatus = q.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await api.put(`/mentor/quizzes/${q.id}`, { ...q, status: nextStatus });
      addToast(`Quiz status updated to ${nextStatus}`, 'success');
      await reloadQuizzes();
    } catch (err) {
      console.error(err);
      addToast('Failed to toggle publication status.', 'error');
    }
  };

  // Questions Builder Actions
  const handleOpenQuestions = async (quiz) => {
    try {
      setActiveQuizForQuestions(quiz);
      // Fetch full quiz with questions
      const res = await api.get(`/student/quizzes/${quiz.id}`); // This fetches details
      
      // Load questions using mentor endpoint or get details
      // Wait, let's fetch details. Since getQuizDetailsForStudent hides answers, 
      // let's fetch it or manage it using a custom load. Or we can just get questions by fetching quiz details. 
      // Wait, on the backend we added getQuizzesByMentor or we can map questions. 
      // Actually, since we own this quiz, let's just make a service call or query mentor side questions.
      // Wait, we have GET /api/mentor/quizzes that maps the list, and we can fetch the detailed quiz on the backend.
      // Let's call standard mentor detail endpoint. Wait, on the backend in MentorQuizController we didn't add a specific getQuizById.
      // But we can get it by requesting the quiz detail. Let's verify how to load the questions with options!
      // In MentorQuizController, GET /mentor/quizzes returns all quizzes owned by the mentor without full details.
      // But we can fetch questions directly by filtering the quiz from `quizzes` if we fetch detailed, or load questions.
      // Wait! We can retrieve them using a custom endpoint or load the quiz. Let's see: on the backend, did we implement an endpoint to get quiz questions?
      // Yes! In QuizServiceImpl, getQuizzesByMentor returns list, but we can easily add a GET /mentor/quizzes/{id} to get full details including answers!
      // Let's verify if we need to add GET /mentor/quizzes/{id} or if we can use another mapping. 
      // Yes, on the backend, let's look at `MentorQuizController.java`. We have:
      // - `POST /mentor/quizzes`
      // - `GET /mentor/quizzes`
      // - `PUT /mentor/quizzes/{id}`
      // - `DELETE /mentor/quizzes/{id}`
      // Wait! Let's check: if we need to load a single quiz details with full answers for the mentor, it would be extremely convenient to have:
      // `GET /mentor/quizzes/{id}`. Let's check if we can add it, or if `quizService.getQuizzesByMentor` can be filtered, or we can add it directly.
      // Yes! Let's add `GET /mentor/quizzes/{id}` endpoint to `MentorQuizController.java` to return the complete quiz with correct option flags!
      // That is extremely easy. We will edit `MentorQuizController.java` to add:
      // ```java
      // @GetMapping("/quizzes/{id}")
      // public ResponseEntity<QuizDto> getQuizDetail(@AuthenticationPrincipal UserDetailsImpl userDetails, @PathVariable Long id) { ... }
      // ```
      // Let's do that right after checking if we need it. Yes! It makes loading questions for editing 100% complete and correct.
      // Let's do that.
    } catch (err) {
      console.error(err);
    }
  };

  const loadQuizQuestions = async (quizId) => {
    try {
      const res = await api.get(`/mentor/quizzes/${quizId}`);
      setQuizQuestions(res.data.questions || []);
    } catch (err) {
      console.error('Failed to load questions:', err);
      addToast('Failed to load questions roster.', 'error');
    }
  };

  const handleOpenQuestionsRoster = async (quiz) => {
    setActiveQuizForQuestions(quiz);
    await loadQuizQuestions(quiz.id);
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!questionForm.questionText.trim()) {
      addToast('Question content is required.', 'error');
      return;
    }
    if (!questionForm.optionA.trim() || !questionForm.optionB.trim() || !questionForm.optionC.trim() || !questionForm.optionD.trim()) {
      addToast('All 4 MCQ options must be specified.', 'error');
      return;
    }

    // Build options payload
    const options = [
      { optionText: questionForm.optionA.trim(), isCorrect: questionForm.correctOptionIndex === 0 },
      { optionText: questionForm.optionB.trim(), isCorrect: questionForm.correctOptionIndex === 1 },
      { optionText: questionForm.optionC.trim(), isCorrect: questionForm.correctOptionIndex === 2 },
      { optionText: questionForm.optionD.trim(), isCorrect: questionForm.correctOptionIndex === 3 }
    ];

    const payload = {
      quizId: activeQuizForQuestions.id,
      questionText: questionForm.questionText.trim(),
      explanation: questionForm.explanation.trim(),
      marks: parseInt(questionForm.marks) || 1,
      options: options
    };

    try {
      if (editingQuestionId) {
        await api.put(`/mentor/questions/${editingQuestionId}`, payload);
        addToast('Question updated successfully.', 'success');
      } else {
        await api.post('/mentor/questions', payload);
        addToast('MCQ Question added to quiz catalog.', 'success');
      }

      setShowQuestionForm(false);
      setEditingQuestionId(null);
      setQuestionForm({
        questionText: '',
        explanation: '',
        marks: 1,
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctOptionIndex: 0
      });
      await loadQuizQuestions(activeQuizForQuestions.id);
    } catch (err) {
      console.error(err);
      addToast('Failed to save MCQ question.', 'error');
    }
  };

  const handleEditQuestion = (q) => {
    setEditingQuestionId(q.id);
    const getOptText = (idx) => q.options && q.options[idx] ? q.options[idx].optionText : '';
    const getOptCorrectIndex = () => {
      if (!q.options) return 0;
      const idx = q.options.findIndex(o => o.isCorrect);
      return idx >= 0 ? idx : 0;
    };

    setQuestionForm({
      questionText: q.questionText,
      explanation: q.explanation || '',
      marks: q.marks,
      optionA: getOptText(0),
      optionB: getOptText(1),
      optionC: getOptText(2),
      optionD: getOptText(3),
      correctOptionIndex: getOptCorrectIndex()
    });
    setShowQuestionForm(true);
  };

  const handleDeleteQuestion = async (qId) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await api.delete(`/mentor/questions/${qId}`);
      addToast('Question deleted.', 'success');
      await loadQuizQuestions(activeQuizForQuestions.id);
    } catch (err) {
      console.error(err);
      addToast('Failed to delete question.', 'error');
    }
  };

  // Analytics Loader
  const handleOpenAnalytics = async (quiz) => {
    try {
      setSelectedQuizAnalytics(quiz);
      const res = await api.get(`/mentor/quizzes/${quiz.id}/analytics`);
      setAnalyticsData(res.data);
      setActiveTab('analytics');
    } catch (err) {
      console.error(err);
      addToast('Failed to load performance analytics for this quiz.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Mentor Console...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
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

      {/* Header */}
      <div className="row mb-5 align-items-center">
        <div className="col-md-8">
          <h1 className="fw-bold text-gradient-primary">Mentor Console</h1>
          <p className="text-muted fs-5">Welcome, {profile?.firstName} {profile?.lastName}. Host study slots, create quizzes, and evaluate performance.</p>
        </div>
        <div className="col-md-4 text-md-end">
          <button className="btn btn-premium-primary" onClick={triggerEditMode}>
            {editMode ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {editMode && (
        <div className="card glass-card p-4 mb-5 shadow-sm">
          <h4 className="fw-bold text-gradient-primary mb-3">Update Mentor Profile</h4>
          <form onSubmit={handleUpdateProfile}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted small fw-semibold">First Name</label>
                <input
                  type="text"
                  className="form-control form-premium"
                  value={editProfile.firstName}
                  onChange={(e) => setEditProfile({ ...editProfile, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted small fw-semibold">Last Name</label>
                <input
                  type="text"
                  className="form-control form-premium"
                  value={editProfile.lastName}
                  onChange={(e) => setEditProfile({ ...editProfile, lastName: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted small fw-semibold">Phone</label>
                <input
                  type="text"
                  className="form-control form-premium"
                  value={editProfile.phone}
                  onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted small fw-semibold">Company</label>
                <input
                  type="text"
                  className="form-control form-premium"
                  value={editProfile.company}
                  onChange={(e) => setEditProfile({ ...editProfile, company: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted small fw-semibold">Designation</label>
                <input
                  type="text"
                  className="form-control form-premium"
                  value={editProfile.designation}
                  onChange={(e) => setEditProfile({ ...editProfile, designation: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted small fw-semibold">Expertise (Comma separated)</label>
                <input
                  type="text"
                  className="form-control form-premium"
                  value={editProfile.expertise}
                  onChange={(e) => setEditProfile({ ...editProfile, expertise: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label text-muted small fw-semibold">Bio</label>
              <textarea
                className="form-control form-premium"
                rows="3"
                value={editProfile.bio}
                onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-premium-primary">Save Profile</button>
          </form>
        </div>
      )}

      {/* Roster tab buttons */}
      <div className="d-flex gap-2 mb-4 border-bottom border-light pb-2">
        <button 
          className={`btn btn-sm py-2 px-3 fw-bold border-0 ${activeTab === 'sessions' ? 'text-primary border-bottom border-primary border-3' : 'text-muted'}`}
          onClick={() => {
            setActiveTab('sessions');
            setActiveQuizForQuestions(null);
          }}
          style={{ background: 'transparent', borderRadius: '0' }}
        >
          <FiCalendar className="me-1" /> Sessions Scheduler
        </button>
        <button 
          className={`btn btn-sm py-2 px-3 fw-bold border-0 ${activeTab === 'quizzes' ? 'text-primary border-bottom border-primary border-3' : 'text-muted'}`}
          onClick={() => {
            setActiveTab('quizzes');
            setActiveQuizForQuestions(null);
          }}
          style={{ background: 'transparent', borderRadius: '0' }}
        >
          <FiBookOpen className="me-1" /> Create Quiz / Assessment
        </button>
        {selectedQuizAnalytics && (
          <button 
            className={`btn btn-sm py-2 px-3 fw-bold border-0 ${activeTab === 'analytics' ? 'text-primary border-bottom border-primary border-3' : 'text-muted'}`}
            onClick={() => setActiveTab('analytics')}
            style={{ background: 'transparent', borderRadius: '0' }}
          >
            <FiTrendingUp className="me-1" /> Quiz Performance Analytics
          </button>
        )}
      </div>

      {/* Sessions scheduler workspace */}
      {activeTab === 'sessions' && (
        <>
          {/* Stats row */}
          <div className="row g-4 mb-5">
            <div className="col-md-3">
              <div className="card glass-card stat-box shadow-sm">
                <FiCalendar className="stat-icon" />
                <div className="stat-number text-gradient-primary">{stats?.totalSessions || 0}</div>
                <div className="stat-label">Total Slots</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card glass-card stat-box shadow-sm">
                <FiCheckSquare className="stat-icon" style={{ color: 'var(--accent)' }} />
                <div className="stat-number" style={{ color: 'var(--accent)' }}>{stats?.completedSessions || 0}</div>
                <div className="stat-label">Sessions Completed</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card glass-card stat-box shadow-sm">
                <FiClock className="stat-icon" style={{ color: 'var(--secondary)' }} />
                <div className="stat-number text-gradient-secondary">{stats?.activeSessions || 0}</div>
                <div className="stat-label">Active Slots</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card glass-card stat-box shadow-sm">
                <FiUser className="stat-icon" style={{ color: '#60a5fa' }} />
                <div className="stat-number" style={{ color: '#60a5fa' }}>{stats?.uniqueStudents || 0}</div>
                <div className="stat-label">Mentees Count</div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-5">
              <div className="card glass-card p-4 shadow-sm">
                <h4 className="fw-bold mb-3 d-flex align-items-center text-gradient-primary">
                  <FiPlusCircle className="me-2" />
                  Schedule Study Session
                </h4>
                <form onSubmit={handleScheduleSession}>
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-semibold">Session Topic / Title</label>
                    <input
                      type="text"
                      className="form-control form-premium"
                      placeholder="e.g. Intro to Spring Boot MVC"
                      value={sessionForm.title}
                      onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted small fw-semibold">Description</label>
                    <textarea
                      className="form-control form-premium"
                      rows="3"
                      placeholder="What will students learn in this slot?"
                      value={sessionForm.description}
                      onChange={(e) => setSessionForm({ ...sessionForm, description: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted small fw-semibold">Date & Time</label>
                    <input
                      type="datetime-local"
                      className="form-control form-premium"
                      value={sessionForm.dateTime}
                      onChange={(e) => setSessionForm({ ...sessionForm, dateTime: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted small fw-semibold">Duration (Minutes)</label>
                    <input
                      type="number"
                      className="form-control form-premium"
                      value={sessionForm.durationMinutes}
                      onChange={(e) => setSessionForm({ ...sessionForm, durationMinutes: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted small fw-semibold">Virtual Meeting URL</label>
                    <input
                      type="url"
                      className="form-control form-premium"
                      value={sessionForm.meetingLink}
                      onChange={(e) => setSessionForm({ ...sessionForm, meetingLink: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-premium-primary w-100 py-3">Schedule Slot</button>
                </form>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="card glass-card p-4 mb-4 shadow-sm">
                <h4 className="fw-bold mb-3 d-flex align-items-center text-gradient-secondary">
                  <FiCalendar className="me-2 text-pink" />
                  Mentorship Schedule / Roster
                </h4>

                {sessions.length === 0 ? (
                  <p className="text-muted small py-4 text-center border border-dashed rounded">No scheduled sessions found. Add a slot to get bookings.</p>
                ) : (
                  <div className="list-group list-group-flush bg-transparent">
                    {sessions.map(s => (
                      <div key={s.id} className="list-group-item bg-transparent text-dark border-bottom border-light px-0 py-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h5 className="fw-bold mb-1 text-gradient-primary">{s.title}</h5>
                            <p className="mb-2 text-muted small">{s.description}</p>
                            <p className="mb-1 text-muted small">
                              <strong>Time:</strong> {new Date(s.dateTime).toLocaleString()} &bull; <strong>Duration:</strong> {s.durationMinutes} mins
                            </p>
                            {s.studentId ? (
                              <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-15 mt-1 small">
                                Booked (Student ID: {s.studentId})
                              </span>
                            ) : (
                              <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-15 mt-1 small">
                                Available Slot
                              </span>
                            )}
                            {s.status === 'COMPLETED' && (
                              <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-15 mt-1 ms-2 small">
                                Completed
                              </span>
                            )}
                          </div>
                          
                          <div className="text-end flex-shrink-0 ms-2">
                            {s.status !== 'COMPLETED' && s.studentId && (
                              <button
                                className="btn btn-xs btn-premium-secondary py-1 px-2 mb-2 d-block"
                                onClick={() => setSelectedSession(s)}
                              >
                                Close &amp; Feedback
                              </button>
                            )}
                            <a href={s.meetingLink} target="_blank" rel="noreferrer" className="btn btn-xs btn-premium-outline py-1 px-2 d-inline-block">Join Call</a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedSession && (
                <div className="card glass-card p-4 shadow-sm">
                  <h4 className="fw-bold mb-3 d-flex align-items-center text-gradient-primary">
                    <FiAward className="me-2" />
                    Provide Session Feedback
                  </h4>
                  <p className="text-muted">Enter comments to guide the student of session: <strong>{selectedSession.title}</strong></p>
                  <form onSubmit={handleCompleteSession}>
                    <div className="mb-3">
                      <label className="form-label text-muted small fw-semibold">Feedback Comments</label>
                      <textarea
                        className="form-control form-premium"
                        rows="3"
                        placeholder="Focus on areas of strength and missing skills..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        required
                      />
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                      <button type="button" className="btn btn-premium-outline" onClick={() => setSelectedSession(null)}>Cancel</button>
                      <button type="submit" className="btn btn-premium-primary">Submit Feedback & Close</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Quizzes and MCQ Assessments workspace */}
      {activeTab === 'quizzes' && (
        <div className="row g-4">
          
          {activeQuizForQuestions === null ? (
            <>
              {/* Left Column: Quiz creator form */}
              <div className="col-lg-5">
                <div className="card glass-card p-4 shadow-sm">
                  <h4 className="fw-bold mb-3 d-flex align-items-center text-gradient-primary">
                    <FiPlusCircle className="me-2" />
                    {editingQuizId ? 'Edit Quiz Config' : 'Create New Assessment'}
                  </h4>
                  <form onSubmit={handleQuizSubmit}>
                    <div className="mb-3">
                      <label className="form-label text-muted small fw-semibold">Quiz Title</label>
                      <input
                        type="text"
                        className="form-control form-premium"
                        placeholder="e.g. Java OOP Fundamentals"
                        value={quizForm.title}
                        onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-muted small fw-semibold">Description / Instructions</label>
                      <textarea
                        className="form-control form-premium"
                        rows="3"
                        placeholder="Explain instructions and topics tested..."
                        value={quizForm.description}
                        onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                      />
                    </div>
                    <div className="row">
                      <div className="col-6 mb-3">
                        <label className="form-label text-muted small fw-semibold">Skill Category</label>
                        <select
                          className="form-select form-premium"
                          value={quizForm.category}
                          onChange={(e) => setQuizForm({ ...quizForm, category: e.target.value })}
                        >
                          <option value="Java">Java</option>
                          <option value="ReactJS">ReactJS</option>
                          <option value="Spring Boot">Spring Boot</option>
                          <option value="MySQL">MySQL</option>
                          <option value="Data Structures">Data Structures</option>
                          <option value="Aptitude">Aptitude</option>
                          <option value="Interview Preparation">Interview Prep</option>
                        </select>
                      </div>
                      <div className="col-6 mb-3">
                        <label className="form-label text-muted small fw-semibold">Difficulty Level</label>
                        <select
                          className="form-select form-premium"
                          value={quizForm.difficulty}
                          onChange={(e) => setQuizForm({ ...quizForm, difficulty: e.target.value })}
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6 mb-3">
                        <label className="form-label text-muted small fw-semibold">Time Limit (Minutes)</label>
                        <input
                          type="number"
                          className="form-control form-premium"
                          value={quizForm.timeLimit}
                          onChange={(e) => setQuizForm({ ...quizForm, timeLimit: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="col-6 mb-3">
                        <label className="form-label text-muted small fw-semibold">Total Marks</label>
                        <input
                          type="number"
                          className="form-control form-premium"
                          value={quizForm.totalMarks}
                          onChange={(e) => setQuizForm({ ...quizForm, totalMarks: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6 mb-3">
                        <label className="form-label text-muted small fw-semibold">Passing Percentage</label>
                        <input
                          type="number"
                          className="form-control form-premium"
                          value={quizForm.passingPercentage}
                          onChange={(e) => setQuizForm({ ...quizForm, passingPercentage: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="col-6 mb-3">
                        <label className="form-label text-muted small fw-semibold">Initial Status</label>
                        <select
                          className="form-select form-premium"
                          value={quizForm.status}
                          onChange={(e) => setQuizForm({ ...quizForm, status: e.target.value })}
                        >
                          <option value="DRAFT">Draft</option>
                          <option value="PUBLISHED">Published</option>
                        </select>
                      </div>
                    </div>

                    <div className="d-flex gap-2 mt-2">
                      <button type="submit" className="btn btn-premium-primary flex-grow-1">
                        {editingQuizId ? 'Update Config' : 'Create Assessment'}
                      </button>
                      {editingQuizId && (
                        <button 
                          type="button" 
                          className="btn btn-premium-outline"
                          onClick={() => {
                            setEditingQuizId(null);
                            setQuizForm({
                              title: '',
                              description: '',
                              category: 'Java',
                              difficulty: 'Beginner',
                              timeLimit: 15,
                              totalMarks: 20,
                              passingPercentage: 60,
                              status: 'DRAFT'
                            });
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column: Quizzes list */}
              <div className="col-lg-7">
                <div className="card glass-card p-4 shadow-sm">
                  <h4 className="fw-bold mb-3 d-flex align-items-center text-gradient-secondary">
                    <FiList className="me-2 text-pink" />
                    Quiz Assessment Catalog
                  </h4>

                  {quizzesLoading ? (
                    <div className="text-center py-4"><span className="spinner-border text-primary" role="status"></span></div>
                  ) : quizzes.length === 0 ? (
                    <p className="text-muted small py-4 text-center border border-dashed rounded">No quiz assessments created yet. Design your first quiz.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0" style={{ color: 'var(--text-main)' }}>
                        <thead style={{ background: 'var(--bg-glass-hover)', borderBottom: '1.5px solid var(--border-color)' }}>
                          <tr className="text-muted small fw-bold">
                            <th>Quiz Title</th>
                            <th>Category</th>
                            <th>Difficulty</th>
                            <th>Time Limit</th>
                            <th>Status</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quizzes.map(q => (
                            <tr key={q.id} className="border-bottom border-light">
                              <td className="fw-bold text-dark">{q.title}</td>
                              <td>{q.category}</td>
                              <td>
                                <span className={`badge ${
                                  q.difficulty === 'Beginner' ? 'bg-success bg-opacity-10 text-success' :
                                  q.difficulty === 'Intermediate' ? 'bg-warning bg-opacity-10 text-warning' :
                                  'bg-danger bg-opacity-10 text-danger'
                                } small`}>
                                  {q.difficulty}
                                </span>
                              </td>
                              <td className="small">{q.timeLimit} min</td>
                              <td>
                                <button 
                                  className={`badge btn border-0 py-1 px-2 ${q.status === 'PUBLISHED' ? 'bg-success text-success bg-opacity-10' : 'bg-secondary text-muted bg-opacity-15'}`}
                                  onClick={() => handleToggleQuizPublish(q)}
                                  title="Click to toggle publish status"
                                >
                                  {q.status}
                                </button>
                              </td>
                              <td className="text-end">
                                <div className="d-flex justify-content-end gap-2">
                                  <button 
                                    className="btn btn-sm btn-outline-primary d-inline-flex align-items-center py-1 px-2"
                                    onClick={() => handleOpenQuestionsRoster(q)}
                                    title="Edit Questions"
                                  >
                                    <FiPlus className="me-1" /> MCQ
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-outline-info d-inline-flex align-items-center py-1 px-2"
                                    onClick={() => handleOpenAnalytics(q)}
                                    title="Student Results"
                                  >
                                    <FiTrendingUp className="me-1" /> Stats
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-link text-warning p-0" 
                                    onClick={() => handleEditQuiz(q)}
                                    title="Edit details"
                                  >
                                    <FiEdit2 size={14} />
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-link text-danger p-0" 
                                    onClick={() => handleDeleteQuiz(q.id)}
                                    title="Delete Quiz"
                                  >
                                    <FiTrash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            // Questions Builder sub-view
            <div className="col-12 animate-fade-in">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <button 
                  className="btn btn-sm btn-premium-outline d-inline-flex align-items-center"
                  onClick={() => setActiveQuizForQuestions(null)}
                >
                  <FiArrowLeft className="me-1" /> Back to Quizzes
                </button>
                <h4 className="fw-bold mb-0 text-gradient-primary">
                  Question Builder &mdash; {activeQuizForQuestions.title}
                </h4>
                <button 
                  className="btn btn-premium-primary btn-sm d-inline-flex align-items-center"
                  onClick={() => {
                    setShowQuestionForm(!showQuestionForm);
                    setEditingQuestionId(null);
                    setQuestionForm({
                      questionText: '',
                      explanation: '',
                      marks: 1,
                      optionA: '',
                      optionB: '',
                      optionC: '',
                      optionD: '',
                      correctOptionIndex: 0
                    });
                  }}
                >
                  <FiPlusCircle className="me-1" /> {showQuestionForm ? 'Cancel Question' : 'Add MCQ Question'}
                </button>
              </div>

              {showQuestionForm && (
                <div className="card glass-card p-4 mb-4 shadow-sm border border-primary border-opacity-20 animate-slide-up">
                  <h5 className="fw-bold text-gradient-primary mb-3">
                    {editingQuestionId ? 'Modify MCQ Question' : 'Create Multiple Choice Question'}
                  </h5>
                  <form onSubmit={handleQuestionSubmit}>
                    <div className="mb-3">
                      <label className="form-label text-muted small fw-semibold">Question Content</label>
                      <textarea
                        className="form-control form-premium"
                        rows="2"
                        placeholder="e.g. Which keyword is used to inherit a class in Java?"
                        value={questionForm.questionText}
                        onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
                        required
                      />
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-semibold">Option A</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light text-muted">A</span>
                          <input
                            type="text"
                            className="form-control form-premium ps-2"
                            value={questionForm.optionA}
                            onChange={(e) => setQuestionForm({ ...questionForm, optionA: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-semibold">Option B</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light text-muted">B</span>
                          <input
                            type="text"
                            className="form-control form-premium ps-2"
                            value={questionForm.optionB}
                            onChange={(e) => setQuestionForm({ ...questionForm, optionB: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-semibold">Option C</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light text-muted">C</span>
                          <input
                            type="text"
                            className="form-control form-premium ps-2"
                            value={questionForm.optionC}
                            onChange={(e) => setQuestionForm({ ...questionForm, optionC: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-semibold">Option D</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light text-muted">D</span>
                          <input
                            type="text"
                            className="form-control form-premium ps-2"
                            value={questionForm.optionD}
                            onChange={(e) => setQuestionForm({ ...questionForm, optionD: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-semibold">Choose Correct Answer</label>
                        <select
                          className="form-select form-premium"
                          value={questionForm.correctOptionIndex}
                          onChange={(e) => setQuestionForm({ ...questionForm, correctOptionIndex: parseInt(e.target.value) })}
                        >
                          <option value={0}>Option A</option>
                          <option value={1}>Option B</option>
                          <option value={2}>Option C</option>
                          <option value={3}>Option D</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-semibold">Marks Weightage</label>
                        <input
                          type="number"
                          className="form-control form-premium"
                          value={questionForm.marks}
                          onChange={(e) => setQuestionForm({ ...questionForm, marks: parseInt(e.target.value) || 1 })}
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-muted small fw-semibold">Correct Answer Explanation</label>
                      <textarea
                        className="form-control form-premium"
                        rows="2"
                        placeholder="Explain why this choice is correct..."
                        value={questionForm.explanation}
                        onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                      />
                    </div>

                    <button type="submit" className="btn btn-premium-primary d-inline-flex align-items-center">
                      <FiSave className="me-1" /> Save MCQ Question
                    </button>
                  </form>
                </div>
              )}

              {/* Roster of active questions */}
              <div className="card glass-card p-4 shadow-sm">
                <h5 className="fw-bold mb-3 text-dark">Added MCQ Roster ({quizQuestions.length} Questions)</h5>

                {quizQuestions.length === 0 ? (
                  <p className="text-muted small py-4 text-center border border-dashed rounded">No questions added yet. Use the tool above to add MCQs.</p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {quizQuestions.map((q, idx) => (
                      <div key={q.id} className="p-3 border border-light rounded bg-light">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="fw-bold mb-1 text-dark">Q{idx + 1}: {q.questionText}</h6>
                          <div className="d-flex gap-2 flex-shrink-0 ms-2">
                            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-15 small me-2 mt-1">{q.marks} Marks</span>
                            <button className="btn btn-sm btn-link text-warning p-0" onClick={() => handleEditQuestion(q)}>
                              <FiEdit2 size={13} />
                            </button>
                            <button className="btn btn-sm btn-link text-danger p-0" onClick={() => handleDeleteQuestion(q.id)}>
                              <FiTrash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <div className="row g-2 mb-2">
                          {q.options && q.options.map((opt, oIdx) => {
                            const letters = ['A', 'B', 'C', 'D'];
                            return (
                              <div className="col-md-6" key={opt.id || oIdx}>
                                <div className={`p-2 rounded border small ${opt.isCorrect ? 'border-success text-success bg-success bg-opacity-5 fw-semibold' : 'border-light bg-white text-muted'}`}>
                                  {letters[oIdx]}. {opt.optionText} {opt.isCorrect && '✓'}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {q.explanation && (
                          <div className="text-muted small p-2 bg-white rounded border border-light mt-1" style={{ fontSize: '0.82rem' }}>
                            <strong>Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Quiz Analytics workspace */}
      {activeTab === 'analytics' && analyticsData && (
        <div className="card glass-card p-4 shadow-sm animate-fade-in">
          <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-light pb-2">
            <div>
              <h4 className="fw-bold text-gradient-primary mb-1">
                Student Performance Analytics
              </h4>
              <p className="text-muted small mb-0">{analyticsData.quizTitle} Assessment Report</p>
            </div>
            <button className="btn btn-sm btn-premium-outline" onClick={() => setSelectedQuizAnalytics(null)}>Close Analytics</button>
          </div>

          <div className="row g-3 mb-5">
            <div className="col-md-3 col-sm-6">
              <div className="p-3 bg-light rounded text-center border border-light shadow-xs">
                <h2 className="fw-extrabold text-primary mb-1">{analyticsData.attemptsCount}</h2>
                <div className="text-muted small fw-semibold">Student Attempts</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="p-3 bg-light rounded text-center border border-light shadow-xs">
                <h2 className="fw-extrabold text-success mb-1">{analyticsData.averageScore}%</h2>
                <div className="text-muted small fw-semibold">Average Score</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="p-3 bg-light rounded text-center border border-light shadow-xs">
                <h2 className="fw-extrabold text-warning mb-1">{analyticsData.highestScore}%</h2>
                <div className="text-muted small fw-semibold">Highest Score</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="p-3 bg-light rounded text-center border border-light shadow-xs">
                <h2 className="fw-extrabold text-danger mb-1">{analyticsData.lowestScore}%</h2>
                <div className="text-muted small fw-semibold">Lowest Score</div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded bg-danger bg-opacity-5 border border-danger border-opacity-10 mb-4">
            <h6 className="fw-bold text-danger mb-1">
              <FiXCircle className="me-1" />
              Most Challenging Core Question:
            </h6>
            <p className="mb-0 text-dark small">{analyticsData.difficultQuestionText}</p>
          </div>

          <h5 className="fw-bold text-dark mb-3">Individual Attempt Logs</h5>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ color: 'var(--text-main)' }}>
              <thead style={{ background: 'var(--bg-glass-hover)', borderBottom: '1.5px solid var(--border-color)' }}>
                <tr className="text-muted small fw-bold">
                  <th>Student</th>
                  <th>Email</th>
                  <th>Scored Marks</th>
                  <th>Percentage Score</th>
                  <th>Grading Result</th>
                  <th>Attempt Date</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.individualScores.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted small">No students have taken this assessment yet.</td>
                  </tr>
                ) : (
                  analyticsData.individualScores.map((log, idx) => (
                    <tr key={idx} className="border-bottom border-light">
                      <td className="fw-semibold text-dark">{log.studentName}</td>
                      <td className="small text-muted">{log.email}</td>
                      <td className="small">{log.score} Marks</td>
                      <td className="fw-bold text-dark">{log.percentage}%</td>
                      <td>
                        <span className={`badge ${log.status === 'PASSED' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'} small`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="small text-muted">{new Date(log.date).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorDashboard;
