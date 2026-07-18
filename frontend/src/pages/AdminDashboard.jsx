import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  FiUsers, FiBookOpen, FiBriefcase, FiTrash2, FiEdit2, 
  FiPlusCircle, FiTrendingUp, FiActivity, FiGlobe 
} from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);

  // Course Form State
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    instructor: '',
    platform: '',
    link: '',
    difficultyLevel: 'Beginner',
    rating: 4.5,
    tags: ''
  });
  const [editingCourseId, setEditingCourseId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const statsRes = await api.get('/admin/dashboard-stats');
      setStats(statsRes.data);

      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data);

      const coursesRes = await api.get('/courses');
      setCourses(coursesRes.data);

      const jobsRes = await api.get('/jobs');
      setJobs(jobsRes.data);

      const internshipsRes = await api.get('/internships');
      setInternships(internshipsRes.data);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // User deletion
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('WARNING: Deleting this user will delete their credentials and all profile data. Proceed?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setMsg('User deleted successfully!');
      setTimeout(() => setMsg(''), 3000);
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Course CRUD
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourseId) {
        await api.put(`/courses/${editingCourseId}`, courseForm);
        setMsg('Course updated successfully!');
      } else {
        await api.post('/courses', courseForm);
        setMsg('Course created successfully!');
      }
      setCourseForm({
        title: '',
        description: '',
        instructor: '',
        platform: '',
        link: '',
        difficultyLevel: 'Beginner',
        rating: 4.5,
        tags: ''
      });
      setShowCourseForm(false);
      setEditingCourseId(null);
      setTimeout(() => setMsg(''), 3000);
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourseId(course.id);
    setCourseForm({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      platform: course.platform,
      link: course.link,
      difficultyLevel: course.difficultyLevel,
      rating: course.rating,
      tags: course.tags
    });
    setShowCourseForm(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Delete this course from catalog?')) return;
    try {
      await api.delete(`/courses/${courseId}`);
      setMsg('Course deleted successfully!');
      setTimeout(() => setMsg(''), 3000);
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Job / Internship moderation deletion
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Moderation: Delete this job posting from the system?')) return;
    try {
      await api.delete(`/admin/jobs/${jobId}`);
      setMsg('Job post deleted by administrator!');
      setTimeout(() => setMsg(''), 3000);
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInternship = async (internshipId) => {
    if (!window.confirm('Moderation: Delete this internship posting from the system?')) return;
    try {
      await api.delete(`/admin/internships/${internshipId}`);
      setMsg('Internship post deleted by administrator!');
      setTimeout(() => setMsg(''), 3000);
      fetchAdminData();
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
          <h1 className="fw-bold text-gradient-primary">Platform Administrator Dashboard</h1>
          <p className="text-muted fs-5">Control user directories, moderate job listings, and customize recommended courses.</p>
        </div>
        <div className="col-md-4 text-md-end">
          <button className="btn btn-premium-primary" onClick={() => {
            setShowCourseForm(!showCourseForm);
            setEditingCourseId(null);
          }}>
            {showCourseForm ? 'Cancel Course Form' : 'Add New Course'}
          </button>
        </div>
      </div>

      {/* Course Form */}
      {showCourseForm && (
        <div className="card glass-card p-4 mb-5">
          <h4 className="fw-bold text-gradient-primary mb-3">
            {editingCourseId ? 'Edit Course Details' : 'Create Recommended Course'}
          </h4>
          <form onSubmit={handleCourseSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted">Course Title</label>
                <input
                  type="text"
                  className="form-control form-premium"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted">Instructor</label>
                <input
                  type="text"
                  className="form-control form-premium"
                  value={courseForm.instructor}
                  onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label text-muted">Platform Partner</label>
                <input
                  type="text"
                  className="form-control form-premium"
                  placeholder="Coursera, Udemy, Academy"
                  value={courseForm.platform}
                  onChange={(e) => setCourseForm({ ...courseForm, platform: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label text-muted">Difficulty Level</label>
                <select
                  className="form-select form-premium"
                  value={courseForm.difficultyLevel}
                  onChange={(e) => setCourseForm({ ...courseForm, difficultyLevel: e.target.value })}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label text-muted">Rating (0.0 - 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control form-premium"
                  value={courseForm.rating}
                  onChange={(e) => setCourseForm({ ...courseForm, rating: parseFloat(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-muted">Target Skills / Tags (Comma separated list)</label>
              <input
                type="text"
                className="form-control form-premium"
                placeholder="e.g. Java, Spring Boot, ReactJS"
                value={courseForm.tags}
                onChange={(e) => setCourseForm({ ...courseForm, tags: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-muted">Syllabus Access Link</label>
              <input
                type="url"
                className="form-control form-premium"
                placeholder="http://example.com/course"
                value={courseForm.link}
                onChange={(e) => setCourseForm({ ...courseForm, link: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-muted">Description</label>
              <textarea
                className="form-control form-premium"
                rows="3"
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-premium-primary">
              {editingCourseId ? 'Update Course' : 'Create Course'}
            </button>
          </form>
        </div>
      )}

      {/* Grid Platform Statistics */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card glass-card stat-box">
            <FiUsers className="stat-icon" />
            <div className="stat-number">{stats?.studentsCount || 0}</div>
            <div className="stat-label">Total Students</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card glass-card stat-box">
            <FiActivity className="stat-icon text-pink" style={{ color: 'var(--secondary)' }} />
            <div className="stat-number">{stats?.mentorsCount || 0}</div>
            <div className="stat-label">Total Mentors</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card glass-card stat-box">
            <FiGlobe className="stat-icon" style={{ color: 'var(--accent)' }} />
            <div className="stat-number">{stats?.recruitersCount || 0}</div>
            <div className="stat-label">Total Recruiters</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card glass-card stat-box">
            <FiBookOpen className="stat-icon" style={{ color: '#60a5fa' }} />
            <div className="stat-number">{stats?.coursesCount || 0}</div>
            <div className="stat-label">Courses Listed</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card glass-card stat-box">
            <FiBriefcase className="stat-icon" style={{ color: '#eab308' }} />
            <div className="stat-number">{stats?.jobsCount || 0}</div>
            <div className="stat-label">Active Jobs</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card glass-card stat-box">
            <FiTrendingUp className="stat-icon text-indigo" />
            <div className="stat-number">{stats?.internshipsCount || 0}</div>
            <div className="stat-label">Active Internships</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* User directory management */}
        <div className="col-lg-6">
          <div className="card glass-card p-4">
            <h4 className="fw-bold mb-3 d-flex align-items-center text-gradient-primary">
              <FiUsers className="me-2" />
              Registered Accounts Directory
            </h4>
            <div className="table-responsive">
              <table className="table table-dark table-hover table-borderless align-middle mb-0">
                <thead>
                  <tr className="border-bottom border-secondary border-opacity-25 text-muted small">
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td className="small">{user.email}</td>
                      <td>
                        <span className={`badge ${
                          user.role === 'ADMIN' ? 'bg-danger bg-opacity-25 text-danger' :
                          user.role === 'STUDENT' ? 'bg-success bg-opacity-25 text-success' :
                          user.role === 'MENTOR' ? 'bg-primary bg-opacity-25 text-primary' :
                          'bg-warning bg-opacity-25 text-warning'
                        } small`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="small text-muted">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                      <td className="text-end">
                        {user.role !== 'ADMIN' && (
                          <button 
                            className="btn btn-sm btn-link text-danger p-0"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <FiTrash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Course & Jobs Management */}
        <div className="col-lg-6">
          {/* Course list */}
          <div className="card glass-card p-4 mb-4">
            <h4 className="fw-bold mb-3 d-flex align-items-center text-gradient-secondary">
              <FiBookOpen className="me-2 text-pink" />
              Course Catalog
            </h4>
            <ul className="list-group list-group-flush bg-transparent">
              {courses.map(course => (
                <li key={course.id} className="list-group-item bg-transparent text-white px-0 py-2 border-bottom border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
                  <div>
                    <span className="fw-bold">{course.title}</span>
                    <div className="small text-muted">{course.platform} &bull; Tags: {course.tags}</div>
                  </div>
                  <div>
                    <FiEdit2 className="text-warning cursor-pointer me-2" onClick={() => handleEditCourse(course)} style={{ cursor: 'pointer' }} />
                    <FiTrash2 className="text-danger cursor-pointer" onClick={() => handleDeleteCourse(course.id)} style={{ cursor: 'pointer' }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Job Listings Moderation */}
          <div className="card glass-card p-4">
            <h4 className="fw-bold mb-3 d-flex align-items-center text-gradient-primary">
              <FiBriefcase className="me-2" />
              Job & Internship Moderation
            </h4>
            <h5 className="text-white mb-2">Jobs</h5>
            <ul className="list-group list-group-flush bg-transparent mb-4">
              {jobs.map(j => (
                <li key={j.id} className="list-group-item bg-transparent text-white px-0 py-2 border-bottom border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
                  <div>
                    <span className="fw-bold">{j.title}</span>
                    <div className="small text-muted">{j.companyName} &bull; {j.location}</div>
                  </div>
                  <button className="btn btn-sm btn-link text-danger p-0" onClick={() => handleDeleteJob(j.id)}>
                    <FiTrash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>

            <h5 className="text-white mb-2">Internships</h5>
            <ul className="list-group list-group-flush bg-transparent">
              {internships.map(i => (
                <li key={i.id} className="list-group-item bg-transparent text-white px-0 py-2 border-bottom border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
                  <div>
                    <span className="fw-bold">{i.title}</span>
                    <div className="small text-muted">{i.companyName} &bull; {i.location}</div>
                  </div>
                  <button className="btn btn-sm btn-link text-danger p-0" onClick={() => handleDeleteInternship(i.id)}>
                    <FiTrash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
