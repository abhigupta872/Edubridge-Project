import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  FiAward, FiBookOpen, FiBriefcase, FiCalendar, FiTrendingUp, 
  FiPlusCircle, FiXCircle, FiCheckCircle, FiFileText, FiEye 
} from 'react-icons/fi';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [skillsList, setSkillsList] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  
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
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

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

      // Fetch courses (public / all)
      const coursesRes = await api.get('/courses');
      setCourses(coursesRes.data);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/student/profile', editForm);
      setProfile(res.data);
      setEditMode(false);
      setMsg('Profile updated successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      console.error(err);
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
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    const updatedSkills = skillsList.filter(s => s !== skillToRemove);
    try {
      const res = await api.put('/student/skills', updatedSkills);
      setProfile(res.data);
      setSkillsList(Array.from(res.data.skills));
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookSession = async (sessionId) => {
    try {
      await api.post(`/student/sessions/book/${sessionId}`);
      setMsg('Session booked successfully!');
      setTimeout(() => setMsg(''), 3000);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
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
      setMsg('Application submitted successfully!');
      setTimeout(() => setMsg(''), 3000);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
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
      setGapLoading(false);
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
        <div className="alert alert-success alert-dismissible fade show" role="alert" style={{ background: 'rgba(25, 135, 84, 0.15)', color: '#75b798', borderColor: 'rgba(25, 135, 84, 0.3)' }}>
          {msg}
        </div>
      )}

      {/* Header and statistics */}
      <div className="row mb-5 align-items-center">
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
        <div className="card glass-card p-4 mb-5">
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

      {/* Stats Counter Row */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card glass-card stat-box">
            <FiAward className="stat-icon" />
            <div className="stat-number">{stats?.skillsCount || 0}</div>
            <div className="stat-label">My Skills</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card glass-card stat-box">
            <FiBriefcase className="stat-icon text-pink" style={{ color: 'var(--secondary)' }} />
            <div className="stat-number">{stats?.appliedCount || 0}</div>
            <div className="stat-label">Applications</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card glass-card stat-box">
            <FiTrendingUp className="stat-icon" style={{ color: 'var(--accent)' }} />
            <div className="stat-number">{stats?.recommendedCount || 0}</div>
            <div className="stat-label">Job Matches</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card glass-card stat-box">
            <FiCalendar className="stat-icon" style={{ color: '#fbbf24' }} />
            <div className="stat-number">{stats?.sessionsCount || 0}</div>
            <div className="stat-label">Mentor Sessions</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left column: Skills Management & Gap report */}
        <div className="col-lg-5">
          {/* Skill lists card */}
          <div className="card glass-card p-4 mb-4">
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
                <span className="text-muted">No skills added yet. Add skills to match jobs!</span>
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

          {/* Skill gap analysis card */}
          <div className="card glass-card p-4">
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
              <div className="mt-4 p-3 rounded bg-dark bg-opacity-50 border border-secondary border-opacity-25">
                <h5 className="fw-bold text-gradient-primary mb-2">{gapReport.title} Gap Analysis</h5>
                <p className="small text-muted">{gapReport.companyName}</p>
                
                <div className="mb-2">
                  <strong>Matching Skills:</strong>
                  <div className="d-flex flex-wrap gap-1 mt-1">
                    {gapReport.matchingSkills.length === 0 ? <span className="text-muted small">None</span> : 
                      gapReport.matchingSkills.map(s => <span key={s} className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-25 small">{s}</span>)
                    }
                  </div>
                </div>

                <div className="mb-3">
                  <strong>Missing Skills:</strong>
                  <div className="d-flex flex-wrap gap-1 mt-1">
                    {gapReport.missingSkills.length === 0 ? <span className="text-success small">Perfect Match!</span> : 
                      gapReport.missingSkills.map(s => <span key={s} className="badge bg-danger bg-opacity-25 text-danger border border-danger border-opacity-25 small">{s}</span>)
                    }
                  </div>
                </div>

                {gapReport.missingSkills.length > 0 && (
                  <div>
                    <strong className="text-gradient-secondary">Recommended Courses:</strong>
                    <ul className="list-unstyled mt-2">
                      {gapReport.recommendedCourses.length === 0 ? (
                        <li className="text-muted small">No specific courses found for these tags.</li>
                      ) : (
                        gapReport.recommendedCourses.map(course => (
                          <li key={course.id} className="mb-2 p-2 rounded bg-secondary bg-opacity-25 border border-secondary border-opacity-25">
                            <div className="d-flex justify-content-between align-items-start">
                              <span className="fw-bold text-white small">{course.title}</span>
                              <a href={course.link} target="_blank" rel="noreferrer" className="btn btn-sm btn-premium-primary py-0 px-2 small" style={{ fontSize: '0.75rem' }}>Start</a>
                            </div>
                            <div className="text-muted small" style={{ fontSize: '0.75rem' }}>{course.platform} &bull; Instructor: {course.instructor}</div>
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
          <div className="card glass-card p-4 mb-4">
            <h4 className="fw-bold mb-3 d-flex align-items-center text-gradient-primary">
              <FiBriefcase className="me-2" />
              Recommended Roles & Internships
            </h4>
            {recommendedJobs.length === 0 ? (
              <p className="text-muted">Add more skills to get personalized job suggestions.</p>
            ) : (
              <div className="list-group list-group-flush bg-transparent">
                {recommendedJobs.map(item => (
                  <div key={item.jobId || item.internshipId} className="list-group-item bg-transparent text-white border-bottom border-secondary border-opacity-25 px-0 py-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="fw-bold mb-1 text-white">
                          {item.title}
                          <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 ms-2 small" style={{ fontSize: '0.7rem' }}>
                            {item.internship ? 'Internship' : 'Full-time'}
                          </span>
                        </h5>
                        <p className="mb-2 text-muted small">{item.companyName} &bull; {item.location}</p>
                        <div className="d-flex flex-wrap gap-1">
                          {Array.from(item.requiredSkills || []).map(skill => (
                            <span key={skill} className="badge bg-secondary bg-opacity-50 text-white small">{skill}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-end">
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
          <div className="card glass-card p-4 mb-4">
            <h4 className="fw-bold mb-3 d-flex align-items-center text-gradient-secondary">
              <FiBookOpen className="me-2" />
              Course Recommendations
            </h4>
            <div className="row g-3">
              {courses.map(course => (
                <div className="col-md-6" key={course.id}>
                  <div className="card h-100 bg-secondary bg-opacity-25 border border-secondary border-opacity-25 p-3">
                    <h6 className="fw-bold text-white mb-1">{course.title}</h6>
                    <p className="text-muted small mb-2">{course.platform} &bull; By {course.instructor}</p>
                    <div className="small text-warning mb-2">&#9733; {course.rating} &bull; <span className="text-muted">{course.difficultyLevel}</span></div>
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <span className="badge bg-indigo bg-opacity-25 text-indigo-200 border border-indigo border-opacity-25 small">{course.tags}</span>
                      <a href={course.link} target="_blank" rel="noreferrer" className="btn btn-sm btn-premium-outline py-1 px-2">Learn</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Applications list */}
          <div className="card glass-card p-4 mb-4">
            <h4 className="fw-bold mb-3 d-flex align-items-center text-gradient-primary">
              <FiFileText className="me-2" />
              Application Tracker
            </h4>
            {applications.length === 0 ? (
              <p className="text-muted">You have not applied for any roles yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover table-borderless align-middle mb-0">
                  <thead>
                    <tr className="border-bottom border-secondary border-opacity-25 text-muted small">
                      <th>Company</th>
                      <th>Title</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app.id}>
                        <td>{app.companyName}</td>
                        <td>{app.jobTitle || app.internshipTitle || 'Position'}</td>
                        <td className="small text-muted">{app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <span className={`badge ${
                            app.status === 'SHORTLISTED' || app.status === 'APPROVED' ? 'bg-success bg-opacity-25 text-success' :
                            app.status === 'REJECTED' ? 'bg-danger bg-opacity-25 text-danger' :
                            'bg-warning bg-opacity-25 text-warning'
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

          {/* Mentorship booking */}
          <div className="card glass-card p-4">
            <h4 className="fw-bold mb-3 d-flex align-items-center text-gradient-secondary">
              <FiCalendar className="me-2" />
              Mentorship & Study Sessions
            </h4>
            <div className="row g-3 mb-4">
              <h5 className="text-white">Your Booked Sessions</h5>
              {sessions.length === 0 ? <p className="text-muted small col-12">No booked sessions.</p> : 
                sessions.map(s => (
                  <div key={s.id} className="col-md-6">
                    <div className="p-3 rounded bg-success bg-opacity-10 border border-success border-opacity-25">
                      <div className="fw-bold text-white mb-1">{s.title}</div>
                      <div className="small text-muted mb-2">Mentor: {s.mentorName || s.mentorId} &bull; Duration: {s.durationMinutes} min</div>
                      <div className="small text-muted mb-2">Time: {new Date(s.dateTime).toLocaleString()}</div>
                      {s.meetingLink && <a href={s.meetingLink} target="_blank" rel="noreferrer" className="btn btn-sm btn-premium-primary w-100 py-1">Join Meeting</a>}
                    </div>
                  </div>
                ))
              }
            </div>

            <div className="row g-3">
              <h5 className="text-white">Available Mentor Slots</h5>
              {availableSessions.length === 0 ? <p className="text-muted small col-12">No available sessions right now.</p> : 
                availableSessions.map(s => (
                  <div key={s.id} className="col-md-6">
                    <div className="p-3 rounded bg-secondary bg-opacity-25 border border-secondary border-opacity-25">
                      <div className="fw-bold text-white mb-1">{s.title}</div>
                      <div className="small text-muted mb-2">Mentor ID: {s.mentorId} &bull; Duration: {s.durationMinutes} min</div>
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
    </div>
  );
};

export default StudentDashboard;
