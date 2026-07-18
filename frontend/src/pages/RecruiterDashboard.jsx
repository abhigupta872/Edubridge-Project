import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiPlusCircle, FiSearch, FiEdit, FiTrash2, FiUserCheck, FiBriefcase, FiFileText, FiAward } from 'react-icons/fi';

const RecruiterDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);

  // Post form states
  const [showForm, setShowForm] = useState(false);
  const [isPostingInternship, setIsPostingInternship] = useState(false);
  const [postForm, setPostForm] = useState({
    title: '',
    description: '',
    companyName: '',
    location: '',
    salaryRange: '',
    stipend: '',
    durationMonths: 6,
    requiredSkills: ''
  });

  // Edit states
  const [editingItem, setEditingItem] = useState(null);

  // Search candidates state
  const [searchSkills, setSearchSkills] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Evaluate candidate state
  const [evaluatingApp, setEvaluatingApp] = useState(null);
  const [evalStatus, setEvalStatus] = useState('SHORTLISTED');
  const [evalFeedback, setEvalFeedback] = useState('');

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchRecruiterData();
  }, []);

  const fetchRecruiterData = async () => {
    try {
      setLoading(true);
      const profileRes = await api.get('/recruiter/profile');
      setProfile(profileRes.data);
      setPostForm(prev => ({
        ...prev,
        companyName: profileRes.data.companyName
      }));

      const statsRes = await api.get('/recruiter/dashboard-stats');
      setStats(statsRes.data);

      const jobsRes = await api.get('/recruiter/jobs');
      setJobs(jobsRes.data);

      const internshipsRes = await api.get('/recruiter/internships');
      setInternships(internshipsRes.data);

      const appsRes = await api.get('/recruiter/applications');
      setApplications(appsRes.data);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handlePostPosition = async (e) => {
    e.preventDefault();
    try {
      // Split requiredSkills comma string to set
      const skillsSet = postForm.requiredSkills
        .split(',')
        .map(s => s.trim())
        .filter(s => s !== '');

      if (isPostingInternship) {
        const payload = {
          title: postForm.title,
          description: postForm.description,
          companyName: postForm.companyName,
          location: postForm.location,
          durationMonths: parseInt(postForm.durationMonths),
          stipend: postForm.stipend,
          requiredSkills: skillsSet
        };

        if (editingItem) {
          await api.put(`/recruiter/internships/${editingItem.id}`, payload);
          setMsg('Internship opportunity updated!');
        } else {
          await api.post('/recruiter/internships', payload);
          setMsg('Internship opportunity posted!');
        }
      } else {
        const payload = {
          title: postForm.title,
          description: postForm.description,
          companyName: postForm.companyName,
          location: postForm.location,
          salaryRange: postForm.salaryRange,
          requiredSkills: skillsSet
        };

        if (editingItem) {
          await api.put(`/recruiter/jobs/${editingItem.id}`, payload);
          setMsg('Job vacancy updated!');
        } else {
          await api.post('/recruiter/jobs', payload);
          setMsg('Job vacancy posted!');
        }
      }

      setPostForm({
        title: '',
        description: '',
        companyName: profile?.companyName || '',
        location: '',
        salaryRange: '',
        stipend: '',
        durationMonths: 6,
        requiredSkills: ''
      });
      setShowForm(false);
      setEditingItem(null);
      setTimeout(() => setMsg(''), 3000);
      fetchRecruiterData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item, isInternship) => {
    setEditingItem(item);
    setIsPostingInternship(isInternship);
    setPostForm({
      title: item.title,
      description: item.description,
      companyName: item.companyName,
      location: item.location,
      salaryRange: item.salaryRange || '',
      stipend: item.stipend || '',
      durationMonths: item.durationMonths || 6,
      requiredSkills: Array.from(item.requiredSkills || []).join(', ')
    });
    setShowForm(true);
  };

  const handleDelete = async (id, isInternship) => {
    if (!window.confirm('Are you sure you want to delete this posting?')) return;
    try {
      if (isInternship) {
        await api.delete(`/recruiter/internships/${id}`);
      } else {
        await api.delete(`/recruiter/jobs/${id}`);
      }
      setMsg('Posting deleted successfully!');
      setTimeout(() => setMsg(''), 3000);
      fetchRecruiterData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchCandidates = async (e) => {
    e.preventDefault();
    try {
      setSearchLoading(true);
      const res = await api.get(`/recruiter/students/search?skills=${encodeURIComponent(searchSkills)}`);
      setSearchResults(res.data);
      setSearchLoading(false);
    } catch (err) {
      console.error(err);
      setSearchLoading(false);
    }
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!evaluatingApp) return;
    try {
      await api.post(`/recruiter/applications/evaluate/${evaluatingApp.id}?status=${evalStatus}&feedback=${encodeURIComponent(evalFeedback)}`);
      setMsg('Candidate application evaluated successfully!');
      setTimeout(() => setMsg(''), 3000);
      setEvaluatingApp(null);
      setEvalFeedback('');
      fetchRecruiterData();
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
          <h1 className="fw-bold text-gradient-primary">Recruiter Workspace</h1>
          <p className="text-muted fs-5">Welcome, {profile?.firstName} {profile?.lastName} ({profile?.companyName}). Post vacancies and evaluate matching talent.</p>
        </div>
        <div className="col-md-4 text-md-end">
          <button className="btn btn-premium-primary" onClick={() => {
            setShowForm(!showForm);
            setEditingItem(null);
          }}>
            {showForm ? 'Cancel Post' : 'Post Job / Internship'}
          </button>
        </div>
      </div>

      {/* Form Card */}
      {showForm && (
        <div className="card glass-card p-4 mb-5">
          <h4 className="fw-bold text-gradient-primary mb-3">
            {editingItem ? 'Edit Opportunity Details' : 'Post New Hiring Opportunity'}
          </h4>
          <div className="mb-4">
            <label className="form-label text-muted d-block">Opportunity Type</label>
            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn py-2 ${!isPostingInternship ? 'btn-premium-primary' : 'btn-premium-outline'}`}
                onClick={() => setIsPostingInternship(false)}
                disabled={editingItem !== null}
              >
                Full-Time Job
              </button>
              <button
                type="button"
                className={`btn py-2 ${isPostingInternship ? 'btn-premium-primary' : 'btn-premium-outline'}`}
                onClick={() => setIsPostingInternship(true)}
                disabled={editingItem !== null}
              >
                Internship Opportunity
              </button>
            </div>
          </div>

          <form onSubmit={handlePostPosition}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted">Role Title</label>
                <input
                  type="text"
                  className="form-control form-premium"
                  value={postForm.title}
                  onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted">Company Name</label>
                <input
                  type="text"
                  className="form-control form-premium"
                  value={postForm.companyName}
                  onChange={(e) => setPostForm({ ...postForm, companyName: e.target.value })}
                  required
                  disabled
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted">Location</label>
                <input
                  type="text"
                  className="form-control form-premium"
                  placeholder="e.g. Remote, Dallas TX"
                  value={postForm.location}
                  onChange={(e) => setPostForm({ ...postForm, location: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                {isPostingInternship ? (
                  <label className="form-label text-muted">Stipend Amount</label>
                ) : (
                  <label className="form-label text-muted">Salary Range</label>
                )}
                <input
                  type="text"
                  className="form-control form-premium"
                  placeholder={isPostingInternship ? 'e.g. $1,500/month' : 'e.g. $80,000 - $95,000'}
                  value={isPostingInternship ? postForm.stipend : postForm.salaryRange}
                  onChange={(e) => {
                    if (isPostingInternship) {
                      setPostForm({ ...postForm, stipend: e.target.value });
                    } else {
                      setPostForm({ ...postForm, salaryRange: e.target.value });
                    }
                  }}
                  required
                />
              </div>
            </div>

            {isPostingInternship && (
              <div className="mb-3">
                <label className="form-label text-muted">Duration (Months)</label>
                <input
                  type="number"
                  className="form-control form-premium"
                  value={postForm.durationMonths}
                  onChange={(e) => setPostForm({ ...postForm, durationMonths: parseInt(e.target.value) })}
                  required
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label text-muted">Required Skills (Comma separated list)</label>
              <input
                type="text"
                className="form-control form-premium"
                placeholder="e.g. Java, ReactJS, MySQL"
                value={postForm.requiredSkills}
                onChange={(e) => setPostForm({ ...postForm, requiredSkills: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-muted">Job Description</label>
              <textarea
                className="form-control form-premium"
                rows="4"
                value={postForm.description}
                onChange={(e) => setPostForm({ ...postForm, description: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-premium-primary">
              {editingItem ? 'Update Post' : 'Post Now'}
            </button>
          </form>
        </div>
      )}

      {/* Stats Counter Row */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card glass-card stat-box">
            <FiBriefcase className="stat-icon" />
            <div className="stat-number">{stats?.jobsPosted || 0}</div>
            <div className="stat-label">Jobs Posted</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card glass-card stat-box">
            <FiPlusCircle className="stat-icon text-pink" style={{ color: 'var(--secondary)' }} />
            <div className="stat-number">{stats?.internshipsPosted || 0}</div>
            <div className="stat-label">Internships Posted</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card glass-card stat-box">
            <FiFileText className="stat-icon" style={{ color: 'var(--accent)' }} />
            <div className="stat-number">{stats?.applicationsReceived || 0}</div>
            <div className="stat-label">Applications Received</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card glass-card stat-box">
            <FiUserCheck className="stat-icon" style={{ color: '#fbbf24' }} />
            <div className="stat-number">{stats?.shortlistedCandidates || 0}</div>
            <div className="stat-label">Shortlisted Candidates</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Postings management & search */}
        <div className="col-lg-6">
          {/* Postings Card */}
          <div className="card glass-card p-4 mb-4">
            <h4 className="fw-bold mb-3 d-flex align-items-center text-gradient-primary">
              <FiBriefcase className="me-2" />
              Active Postings List
            </h4>
            <div className="accordion accordion-dark" id="postingsAccordion">
              <h5 className="text-white mb-2">Jobs</h5>
              {jobs.length === 0 ? <p className="text-muted small">No jobs posted yet.</p> : 
                jobs.map(j => (
                  <div key={j.id} className="p-3 mb-2 rounded bg-secondary bg-opacity-25 border border-secondary border-opacity-25">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-white">{j.title} ({j.location})</span>
                      <div>
                        <FiEdit className="me-2 text-warning cursor-pointer" onClick={() => handleEdit(j, false)} style={{ cursor: 'pointer' }} />
                        <FiTrash2 className="text-danger cursor-pointer" onClick={() => handleDelete(j.id, false)} style={{ cursor: 'pointer' }} />
                      </div>
                    </div>
                    <div className="small text-muted mt-1">{j.description}</div>
                    <div className="small text-muted mt-1"><strong>Skills:</strong> {Array.from(j.requiredSkills || []).join(', ')}</div>
                  </div>
                ))
              }

              <h5 className="text-white mt-4 mb-2">Internships</h5>
              {internships.length === 0 ? <p className="text-muted small">No internships posted yet.</p> : 
                internships.map(i => (
                  <div key={i.id} className="p-3 mb-2 rounded bg-secondary bg-opacity-25 border border-secondary border-opacity-25">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-white">{i.title} ({i.location})</span>
                      <div>
                        <FiEdit className="me-2 text-warning cursor-pointer" onClick={() => handleEdit(i, true)} style={{ cursor: 'pointer' }} />
                        <FiTrash2 className="text-danger cursor-pointer" onClick={() => handleDelete(i.id, true)} style={{ cursor: 'pointer' }} />
                      </div>
                    </div>
                    <div className="small text-muted mt-1">Stipend: {i.stipend} &bull; Duration: {i.durationMonths} months</div>
                    <div className="small text-muted mt-1">{i.description}</div>
                    <div className="small text-muted mt-1"><strong>Skills:</strong> {Array.from(i.requiredSkills || []).join(', ')}</div>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Student Search */}
          <div className="card glass-card p-4">
            <h4 className="fw-bold mb-3 d-flex align-items-center text-gradient-secondary">
              <FiSearch className="me-2 text-pink" />
              Skill-Based Student Finder
            </h4>
            <form onSubmit={handleSearchCandidates} className="d-flex mb-4">
              <input
                type="text"
                className="form-control form-premium me-2"
                placeholder="Enter skills (e.g. Java, ReactJS)"
                value={searchSkills}
                onChange={(e) => setSearchSkills(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-premium-secondary d-flex align-items-center">
                Search
              </button>
            </form>

            {searchLoading ? (
              <p className="text-center text-muted">Searching students database...</p>
            ) : (
              <ul className="list-group list-group-flush bg-transparent">
                {searchResults.map(match => (
                  <li key={match.studentId} className="list-group-item bg-transparent text-white px-0 py-3 border-bottom border-secondary border-opacity-25">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="fw-bold text-white mb-1">{match.firstName} {match.lastName}</h6>
                        <div className="small text-muted mb-2">{match.currentEducation} &bull; {match.institution}</div>
                        <div className="d-flex flex-wrap gap-1">
                          {Array.from(match.skills || []).map(skill => (
                            <span key={skill} className="badge bg-secondary bg-opacity-50 text-white small">{skill}</span>
                          ))}
                        </div>
                      </div>
                      <span className="badge-premium-accent">{match.matchPercentage}% Skill Match</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Column: Applicant Tracking */}
        <div className="col-lg-6">
          <div className="card glass-card p-4 mb-4">
            <h4 className="fw-bold mb-3 d-flex align-items-center text-gradient-primary">
              <FiFileText className="me-2" />
              Applications Dashboard
            </h4>

            {applications.length === 0 ? (
              <p className="text-muted">No candidate applications received yet.</p>
            ) : (
              <div className="list-group list-group-flush bg-transparent">
                {applications.map(app => (
                  <div key={app.id} className="list-group-item bg-transparent text-white px-0 py-3 border-bottom border-secondary border-opacity-25">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="fw-bold mb-1 text-white">{app.studentName}</h5>
                        <p className="small text-muted mb-1">Applied for: <strong>{app.jobTitle || app.internshipTitle || 'Position'}</strong></p>
                        <p className="small text-muted mb-2">Applied date: {new Date(app.appliedDate).toLocaleDateString()}</p>
                        <div className="mb-2">
                          <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-premium-outline py-0 px-2 small">View Resume</a>
                        </div>
                        <span className={`badge ${
                          app.status === 'SHORTLISTED' ? 'bg-success bg-opacity-25 text-success' :
                          app.status === 'REJECTED' ? 'bg-danger bg-opacity-25 text-danger' :
                          'bg-warning bg-opacity-25 text-warning'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      
                      <div>
                        {app.status === 'PENDING' && (
                          <button
                            className="btn btn-sm btn-premium-primary"
                            onClick={() => setEvaluatingApp(app)}
                          >
                            Evaluate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {evaluatingApp && (
            <div className="card glass-card p-4">
              <h4 className="fw-bold mb-3 d-flex align-items-center text-gradient-secondary">
                <FiUserCheck className="me-2 text-pink" />
                Evaluate Application
              </h4>
              <p className="text-muted">Evaluate candidate <strong>{evaluatingApp.studentName}</strong> for role <strong>{evaluatingApp.jobTitle || evaluatingApp.internshipTitle || 'Position'}</strong></p>
              <form onSubmit={handleEvaluate}>
                <div className="mb-3">
                  <label className="form-label text-muted">Status</label>
                  <select 
                    className="form-select form-premium"
                    value={evalStatus}
                    onChange={(e) => setEvalStatus(e.target.value)}
                  >
                    <option value="SHORTLISTED">SHORTLISTED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted">Feedback / Interview comments</label>
                  <textarea
                    className="form-control form-premium"
                    rows="3"
                    placeholder="Enter shortlisting reasons or rejection feedback..."
                    value={evalFeedback}
                    onChange={(e) => setEvalFeedback(e.target.value)}
                    required
                  />
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-premium-outline" onClick={() => setEvaluatingApp(null)}>Cancel</button>
                  <button type="submit" className="btn btn-premium-primary">Submit Evaluation</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
