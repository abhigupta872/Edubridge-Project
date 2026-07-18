import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiCalendar, FiClock, FiPlusCircle, FiCheckSquare, FiAward, FiUser } from 'react-icons/fi';

const MentorDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);
  
  // New session state
  const [sessionForm, setSessionForm] = useState({
    title: '',
    description: '',
    dateTime: '',
    durationMinutes: 45,
    meetingLink: 'https://meet.google.com/abc-defg-hij'
  });

  // Edit profile state
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

  // Feedback state
  const [selectedSession, setSelectedSession] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchMentorData();
  }, []);

  const fetchMentorData = async () => {
    try {
      setLoading(true);
      const profileRes = await api.get('/mentor/profile');
      setProfile(profileRes.data);
      setEditProfile({
        firstName: profileRes.data.firstName,
        lastName: profileRes.data.lastName,
        phone: profileRes.data.phone || '',
        bio: profileRes.data.bio || '',
        company: profileRes.data.company || '',
        designation: profileRes.data.designation || '',
        expertise: profileRes.data.expertise || ''
      });

      const statsRes = await api.get('/mentor/dashboard-stats');
      setStats(statsRes.data);

      const sessionsRes = await api.get('/mentor/sessions');
      setSessions(sessionsRes.data);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/mentor/profile', editProfile);
      setProfile(res.data);
      setEditMode(false);
      setMsg('Profile details updated successfully!');
      setTimeout(() => setMsg(''), 3000);
      fetchMentorData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleScheduleSession = async (e) => {
    e.preventDefault();
    try {
      // API expects MentorSessionDto
      await api.post('/mentor/sessions', sessionForm);
      setMsg('Mentorship session scheduled successfully!');
      setTimeout(() => setMsg(''), 3000);
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
    }
  };

  const handleCompleteSession = async (e) => {
    e.preventDefault();
    if (!selectedSession) return;
    try {
      await api.post(`/mentor/sessions/complete/${selectedSession.id}?feedback=${encodeURIComponent(feedbackText)}`);
      setMsg('Session marked as completed!');
      setTimeout(() => setMsg(''), 3000);
      setSelectedSession(null);
      setFeedbackText('');
      fetchMentorData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {msg && (
        <div className="alert alert-success" role="alert" style={{ background: 'rgba(25, 135, 84, 0.15)', color: '#75b798', borderColor: 'rgba(25, 135, 84, 0.3)' }}>
          {msg}
        </div>
      )}

      {/* Header */}
      <div className="row mb-5 align-items-center">
        <div className="col-md-8">
          <h1 className="fw-bold text-gradient-primary">Mentor Console</h1>
          <p className="text-muted fs-5">Welcome, Dr. {profile?.firstName} {profile?.lastName}. Host study slots and guide learners.</p>
        </div>
        <div className="col-md-4 text-md-end">
          <button className="btn btn-premium-primary" onClick={() => setEditMode(!editMode)}>
            {editMode ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {editMode && (
        <div className="card glass-card p-4 mb-5">
          <h4 className="fw-bold text-gradient-primary mb-3">Update Mentor Profile</h4>
          <form onSubmit={handleUpdateProfile}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted">First Name</label>
                <input
                  type="text"
                  className="form-control form-premium"
                  value={editProfile.firstName}
                  onChange={(e) => setEditProfile({ ...editProfile, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted">Last Name</label>
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
                <label className="form-label text-muted">Phone</label>
                <input
                  type="text"
                  className="form-control form-premium"
                  value={editProfile.phone}
                  onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted">Company</label>
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
                <label className="form-label text-muted">Designation</label>
                <input
                  type="text"
                  className="form-control form-premium"
                  value={editProfile.designation}
                  onChange={(e) => setEditProfile({ ...editProfile, designation: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted">Expertise (Comma separated)</label>
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
              <label className="form-label text-muted">Bio</label>
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

      {/* Stats row */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card glass-card stat-box">
            <FiCalendar className="stat-icon" />
            <div className="stat-number">{stats?.totalSessions || 0}</div>
            <div className="stat-label">Total Slots</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card glass-card stat-box">
            <FiCheckSquare className="stat-icon" style={{ color: 'var(--accent)' }} />
            <div className="stat-number">{stats?.completedSessions || 0}</div>
            <div className="stat-label">Sessions Completed</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card glass-card stat-box">
            <FiClock className="stat-icon" style={{ color: 'var(--secondary)' }} />
            <div className="stat-number">{stats?.activeSessions || 0}</div>
            <div className="stat-label">Active Slots</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card glass-card stat-box">
            <FiUser className="stat-icon" style={{ color: '#60a5fa' }} />
            <div className="stat-number">{stats?.uniqueStudents || 0}</div>
            <div className="stat-label">Mentees Count</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Schedule Form */}
        <div className="col-lg-5">
          <div className="card glass-card p-4">
            <h4 className="fw-bold mb-3 d-flex align-items-center text-gradient-primary">
              <FiPlusCircle className="me-2" />
              Schedule Study Session
            </h4>
            <form onSubmit={handleScheduleSession}>
              <div className="mb-3">
                <label className="form-label text-muted">Session Topic / Title</label>
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
                <label className="form-label text-muted">Description</label>
                <textarea
                  className="form-control form-premium"
                  rows="3"
                  placeholder="What will students learn in this slot?"
                  value={sessionForm.description}
                  onChange={(e) => setSessionForm({ ...sessionForm, description: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted">Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-control form-premium"
                  value={sessionForm.dateTime}
                  onChange={(e) => setSessionForm({ ...sessionForm, dateTime: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted">Duration (Minutes)</label>
                <input
                  type="number"
                  className="form-control form-premium"
                  value={sessionForm.durationMinutes}
                  onChange={(e) => setSessionForm({ ...sessionForm, durationMinutes: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted">Virtual Meeting URL</label>
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

        {/* Right Column: Sessions List */}
        <div className="col-lg-7">
          <div className="card glass-card p-4 mb-4">
            <h4 className="fw-bold mb-3 d-flex align-items-center text-gradient-secondary">
              <FiCalendar className="me-2 text-pink" />
              Mentorship Schedule / Roster
            </h4>

            {sessions.length === 0 ? (
              <p className="text-muted">No scheduled sessions found. Add a slot to get bookings.</p>
            ) : (
              <div className="list-group list-group-flush bg-transparent">
                {sessions.map(s => (
                  <div key={s.id} className="list-group-item bg-transparent text-white border-bottom border-secondary border-opacity-25 px-0 py-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="fw-bold mb-1 text-white">{s.title}</h5>
                        <p className="mb-2 text-muted small">{s.description}</p>
                        <p className="mb-1 text-muted small">
                          <strong>Time:</strong> {new Date(s.dateTime).toLocaleString()} &bull; <strong>Duration:</strong> {s.durationMinutes} mins
                        </p>
                        {s.studentId ? (
                          <div className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-25 mt-1 small">
                            Booked (Student ID: {s.studentId})
                          </div>
                        ) : (
                          <div className="badge bg-warning bg-opacity-25 text-warning border border-warning border-opacity-25 mt-1 small">
                            Available
                          </div>
                        )}
                        {s.status === 'COMPLETED' && (
                          <div className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-25 mt-1 ms-2 small">
                            Completed
                          </div>
                        )}
                      </div>
                      
                      <div className="text-end">
                        {s.status !== 'COMPLETED' && s.studentId && (
                          <button
                            className="btn btn-sm btn-premium-secondary"
                            onClick={() => setSelectedSession(s)}
                          >
                            Close / Feedback
                          </button>
                        )}
                        <div className="mt-2">
                          <a href={s.meetingLink} target="_blank" rel="noreferrer" className="btn btn-sm btn-premium-outline">Join</a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedSession && (
            <div className="card glass-card p-4">
              <h4 className="fw-bold mb-3 d-flex align-items-center text-gradient-primary">
                <FiAward className="me-2" />
                Provide Session Feedback
              </h4>
              <p className="text-muted">Enter comments to guide the student of session: <strong>{selectedSession.title}</strong></p>
              <form onSubmit={handleCompleteSession}>
                <div className="mb-3">
                  <label className="form-label text-muted">Feedback Comments</label>
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
    </div>
  );
};

export default MentorDashboard;
