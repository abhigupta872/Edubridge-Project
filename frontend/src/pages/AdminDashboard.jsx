import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  FiUsers, FiBookOpen, FiBriefcase, FiTrash2, FiEdit2, 
  FiPlusCircle, FiTrendingUp, FiActivity, FiGlobe, FiSearch, 
  FiFilter, FiEye, FiCheckCircle, FiXCircle, FiInfo, FiExternalLink, FiStar 
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
    <div style={{ width: '55px', height: '55px', flexShrink: 0 }}>
      <svg viewBox="0 0 48 48" className="w-100 h-100">
        <rect width="48" height="48" rx="10" fill={`${color}12`} />
        {path}
      </svg>
    </div>
  );
};

const AdminDashboard = () => {
  // Master Data
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);

  // UI State Handling
  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [submittingCourse, setSubmittingCourse] = useState(false);

  // Search & Pagination States
  const [userSearch, setUserSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const usersPerPage = 5;

  const [courseSearch, setCourseSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [coursePage, setCoursePage] = useState(1);
  const coursesPerPage = 6;
  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);

  const [modSearch, setModSearch] = useState('');
  const [modTypeFilter, setModTypeFilter] = useState('All');
  const [modStatusFilter, setModStatusFilter] = useState('All');
  const [modPage, setModPage] = useState(1);
  const modPerPage = 5;
  const [selectedListingDetails, setSelectedListingDetails] = useState(null);

  // Custom Toast Notification State
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // Course Form State
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
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
  
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setCoursesLoading(true);
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
      setCoursesLoading(false);
    } catch (err) {
      console.error(err);
      addToast('Failed to load system directory records. Try refreshing.', 'error');
      setLoading(false);
      setCoursesLoading(false);
    }
  };

  const silentReload = async () => {
    try {
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
    } catch (err) {
      console.error('Silent refresh failure:', err);
    }
  };

  // User Deletion
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('WARNING: Are you sure you want to permanently delete this user account? This cascading operation removes their respective profiles and mappings automatically.')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      addToast('User account successfully purged from system directory.', 'success');
      await silentReload();
    } catch (err) {
      console.error(err);
      addToast('Failed to delete account.', 'error');
    }
  };

  // Course Form Validation
  const validateForm = () => {
    const errors = {};
    if (!courseForm.title.trim()) errors.title = 'Title is required';
    if (!courseForm.instructor.trim()) errors.instructor = 'Instructor is required';
    if (!courseForm.platform.trim()) errors.platform = 'Platform is required';
    if (!courseForm.tags.trim()) errors.tags = 'Skill tags are required';
    if (!courseForm.description.trim()) errors.description = 'Description roadmap is required';

    if (!courseForm.link.trim()) {
      errors.link = 'Syllabus URL link is required';
    } else {
      let testUrl = courseForm.link.trim();
      if (!/^https?:\/\//i.test(testUrl)) {
        testUrl = `https://${testUrl}`;
      }
      try {
        new URL(testUrl);
      } catch (e) {
        errors.link = 'Please provide a valid platform URL';
      }
    }

    const rate = parseFloat(courseForm.rating);
    if (isNaN(rate) || rate < 0 || rate > 5) {
      errors.rating = 'Rating must be a decimal between 0.0 and 5.0';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Course Form Add / Edit
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmittingCourse(true);

    try {
      if (editingCourseId) {
        await api.put(`/courses/${editingCourseId}`, courseForm);
        addToast('Course catalog mapping updated successfully!', 'success');
      } else {
        await api.post('/courses', courseForm);
        addToast('New course successfully published to the catalog!', 'success');
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
      setFormErrors({});
      await silentReload();
    } catch (err) {
      console.error(err);
      addToast('Failed to save course. Review inputs and try again.', 'error');
    } finally {
      setSubmittingCourse(false);
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
    setFormErrors({});
    setShowCourseForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course from the public catalog?')) return;
    try {
      await api.delete(`/courses/${courseId}`);
      addToast('Course successfully deleted.', 'success');
      await silentReload();
    } catch (err) {
      console.error(err);
      addToast('Failed to delete course record.', 'error');
    }
  };

  // Course Redirection, Link Validation, and Analytics Track
  const handleVisitCourse = async (course) => {
    const { link, id, title } = course;
    if (!link || !link.trim()) {
      addToast(`Unable to redirect. Syllabus link is missing for: "${title}"`, 'error');
      return;
    }

    let finalUrl = link.trim();
    
    // Graceful fallback for mock localhost seed links to point to real external web resources
    if (finalUrl.includes('localhost:3000/courses/1')) {
      finalUrl = 'https://spring.io/projects/spring-boot';
    } else if (finalUrl.includes('localhost:3000/courses/2')) {
      finalUrl = 'https://react.dev';
    } else if (finalUrl.includes('localhost:3000/courses/3')) {
      finalUrl = 'https://www.udemy.com';
    }

    // Prepend protocol if absent
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`;
    }

    // Run browser validation check
    try {
      new URL(finalUrl);
    } catch (e) {
      addToast(`Invalid syllabus link format: "${link}"`, 'error');
      return;
    }
    
    // Track click analytics
    try {
      await api.post(`/courses/${id}/click`);
      setCourses(prev => prev.map(c => c.id === id ? { ...c, clickCount: (c.clickCount || 0) + 1 } : c));
    } catch (err) {
      console.error('Failed to log click analytics:', err);
    }

    window.open(finalUrl, '_blank', 'noopener,noreferrer');
    addToast(`Redirecting to external platform course link...`, 'success');
  };

  // Job / Internship moderation
  const handleDeleteListing = async (id, isInternship) => {
    if (!window.confirm(`Are you sure you want to permanently delete this ${isInternship ? 'internship' : 'job'} posting?`)) return;
    try {
      if (isInternship) {
        await api.delete(`/admin/internships/${id}`);
      } else {
        await api.delete(`/admin/jobs/${id}`);
      }
      addToast('Listing moderation successful: Post deleted.', 'success');
      await silentReload();
    } catch (err) {
      console.error(err);
      addToast('Failed to delete listing.', 'error');
    }
  };

  const handleModerateStatus = async (id, type, newStatus) => {
    try {
      if (type === 'Internship') {
        await api.put(`/admin/internships/${id}/status?status=${newStatus}`);
      } else {
        await api.put(`/admin/jobs/${id}/status?status=${newStatus}`);
      }
      addToast(`Position status moderated to "${newStatus}"`, 'success');
      await silentReload();
    } catch (err) {
      console.error(err);
      addToast('Failed to moderate listing status.', 'error');
    }
  };

  // Computations
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearch.toLowerCase())
  );
  const totalUserPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice((userPage - 1) * usersPerPage, userPage * usersPerPage);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
      course.instructor.toLowerCase().includes(courseSearch.toLowerCase()) ||
      course.platform.toLowerCase().includes(courseSearch.toLowerCase()) ||
      course.tags.toLowerCase().includes(courseSearch.toLowerCase());
    const matchesFilter = courseFilter === 'All' || course.difficultyLevel === courseFilter;
    return matchesSearch && matchesFilter;
  });
  const totalCoursePages = Math.ceil(filteredCourses.length / coursesPerPage);
  const currentCourses = filteredCourses.slice((coursePage - 1) * coursesPerPage, coursePage * coursesPerPage);

  const combinedListings = [
    ...jobs.map(j => ({ ...j, type: 'Job', keyId: `job-${j.id}` })),
    ...internships.map(i => ({ ...i, type: 'Internship', keyId: `intern-${i.id}` }))
  ];

  const filteredListings = combinedListings.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(modSearch.toLowerCase()) ||
      item.companyName.toLowerCase().includes(modSearch.toLowerCase()) ||
      item.location.toLowerCase().includes(modSearch.toLowerCase()) ||
      (item.recruiterName && item.recruiterName.toLowerCase().includes(modSearch.toLowerCase()));
    const matchesType = modTypeFilter === 'All' || item.type === modTypeFilter;
    const statusVal = item.status || 'ACTIVE';
    const matchesStatus = modStatusFilter === 'All' || statusVal.toUpperCase() === modStatusFilter.toUpperCase();
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalModPages = Math.ceil(filteredListings.length / modPerPage);
  const currentListings = filteredListings.slice((modPage - 1) * modPerPage, modPage * modPerPage);

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

      {/* Header */}
      <div className="row mb-5 align-items-center">
        <div className="col-md-8">
          <h1 className="fw-bold text-gradient-primary">Platform Administrator Dashboard</h1>
          <p className="text-muted fs-5">Control user directories, moderate job listings, and customize recommended courses.</p>
        </div>
        <div className="col-md-4 text-md-end">
          <button 
            className="btn btn-premium-primary d-inline-flex align-items-center" 
            onClick={() => {
              setShowCourseForm(!showCourseForm);
              setEditingCourseId(null);
              setFormErrors({});
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
            }}
          >
            <FiPlusCircle className="me-1" /> {showCourseForm ? 'Cancel Course Form' : 'Add New Course'}
          </button>
        </div>
      </div>

      {/* Course Form */}
      {showCourseForm && (
        <div className="card glass-card p-4 mb-5 shadow-lg">
          <h4 className="fw-bold text-gradient-primary mb-3">
            {editingCourseId ? 'Edit Course Details' : 'Create Recommended Course'}
          </h4>
          <form onSubmit={handleCourseSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted small fw-semibold">Course Title</label>
                <input
                  type="text"
                  className={`form-control form-premium ${formErrors.title ? 'is-invalid' : ''}`}
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="e.g. Java Masterclass"
                />
                {formErrors.title && <div className="invalid-feedback">{formErrors.title}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted small fw-semibold">Instructor Name</label>
                <input
                  type="text"
                  className={`form-control form-premium ${formErrors.instructor ? 'is-invalid' : ''}`}
                  value={courseForm.instructor}
                  onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                  placeholder="e.g. Dr. Sarah Jenkins"
                />
                {formErrors.instructor && <div className="invalid-feedback">{formErrors.instructor}</div>}
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label text-muted small fw-semibold">Platform Partner</label>
                <input
                  type="text"
                  className={`form-control form-premium ${formErrors.platform ? 'is-invalid' : ''}`}
                  placeholder="Coursera, Udemy, Academy"
                  value={courseForm.platform}
                  onChange={(e) => setCourseForm({ ...courseForm, platform: e.target.value })}
                />
                {formErrors.platform && <div className="invalid-feedback">{formErrors.platform}</div>}
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label text-muted small fw-semibold">Difficulty Level</label>
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
                <label className="form-label text-muted small fw-semibold">Rating (0.0 - 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  className={`form-control form-premium ${formErrors.rating ? 'is-invalid' : ''}`}
                  value={courseForm.rating}
                  onChange={(e) => setCourseForm({ ...courseForm, rating: parseFloat(e.target.value) || 0 })}
                />
                {formErrors.rating && <div className="invalid-feedback">{formErrors.rating}</div>}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-muted small fw-semibold">Target Skill Tags (Comma-separated)</label>
              <input
                type="text"
                className={`form-control form-premium ${formErrors.tags ? 'is-invalid' : ''}`}
                placeholder="e.g. Java, Spring Boot, ReactJS"
                value={courseForm.tags}
                onChange={(e) => setCourseForm({ ...courseForm, tags: e.target.value })}
              />
              {formErrors.tags && <div className="invalid-feedback">{formErrors.tags}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label text-muted small fw-semibold">Syllabus Access Link</label>
              <input
                type="text"
                className={`form-control form-premium ${formErrors.link ? 'is-invalid' : ''}`}
                placeholder="e.g. www.udemy.com/course-link"
                value={courseForm.link}
                onChange={(e) => setCourseForm({ ...courseForm, link: e.target.value })}
              />
              {formErrors.link && <div className="invalid-feedback">{formErrors.link}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label text-muted small fw-semibold">Description</label>
              <textarea
                className={`form-control form-premium ${formErrors.description ? 'is-invalid' : ''}`}
                rows="3"
                placeholder="Provide a brief roadmap synopsis..."
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
              />
              {formErrors.description && <div className="invalid-feedback">{formErrors.description}</div>}
            </div>

            <div className="d-flex gap-2">
              <button 
                type="submit" 
                className="btn btn-premium-primary"
                disabled={submittingCourse}
              >
                {submittingCourse ? 'Saving details...' : (editingCourseId ? 'Update Course' : 'Create Course')}
              </button>
              <button 
                type="button" 
                className="btn btn-premium-outline"
                onClick={() => {
                  setShowCourseForm(false);
                  setEditingCourseId(null);
                  setFormErrors({});
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid Platform Statistics (Live Dashboard Metrics) */}
      <div className="row g-4 mb-5">
        <div className="col-md-4 col-sm-6">
          <div className="card glass-card stat-box shadow-sm">
            <FiUsers className="stat-icon" />
            <div className="stat-number text-gradient-primary">{stats?.studentsCount || 0}</div>
            <div className="stat-label text-muted">Total Students</div>
          </div>
        </div>
        <div className="col-md-4 col-sm-6">
          <div className="card glass-card stat-box shadow-sm">
            <FiActivity className="stat-icon" style={{ color: 'var(--secondary)' }} />
            <div className="stat-number text-gradient-secondary">{stats?.mentorsCount || 0}</div>
            <div className="stat-label text-muted">Total Mentors</div>
          </div>
        </div>
        <div className="col-md-4 col-sm-6">
          <div className="card glass-card stat-box shadow-sm">
            <FiGlobe className="stat-icon" style={{ color: 'var(--accent)' }} />
            <div className="stat-number" style={{ color: 'var(--accent)' }}>{stats?.recruitersCount || 0}</div>
            <div className="stat-label text-muted">Total Recruiters</div>
          </div>
        </div>
        <div className="col-md-4 col-sm-6">
          <div className="card glass-card stat-box shadow-sm">
            <FiBookOpen className="stat-icon" style={{ color: '#3b82f6' }} />
            <div className="stat-number" style={{ color: '#3b82f6' }}>{stats?.coursesCount || 0}</div>
            <div className="stat-label text-muted">Courses Listed</div>
          </div>
        </div>
        <div className="col-md-4 col-sm-6">
          <div className="card glass-card stat-box shadow-sm">
            <FiBriefcase className="stat-icon" style={{ color: '#eab308' }} />
            <div className="stat-number" style={{ color: '#eab308' }}>{stats?.jobsCount || 0}</div>
            <div className="stat-label text-muted">Active Jobs</div>
          </div>
        </div>
        <div className="col-md-4 col-sm-6">
          <div className="card glass-card stat-box shadow-sm">
            <FiTrendingUp className="stat-icon" style={{ color: '#a855f7' }} />
            <div className="stat-number" style={{ color: '#a855f7' }}>{stats?.internshipsCount || 0}</div>
            <div className="stat-label text-muted">Active Internships</div>
          </div>
        </div>
      </div>

      {/* Course Catalog Grid */}
      <div className="row g-4 mb-5">
        <div className="col-lg-12">
          <div className="card glass-card p-4 shadow-sm">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
              <div>
                <h4 className="fw-bold mb-1 d-flex align-items-center text-gradient-secondary">
                  <FiBookOpen className="me-2 text-pink" />
                  Course Recommendations Catalog
                </h4>
                <p className="text-muted small mb-0">Browse platform recommendations. Click title or "Visit Course" to view syllabi directly.</p>
              </div>

              <div className="d-flex flex-wrap gap-2 align-items-center">
                <div className="input-group input-group-sm" style={{ width: '220px' }}>
                  <span className="input-group-text bg-white border-end-0 text-muted"><FiSearch /></span>
                  <input
                    type="text"
                    className="form-control form-premium py-1 ps-1 border-start-0"
                    placeholder="Search courses..."
                    value={courseSearch}
                    onChange={(e) => {
                      setCourseSearch(e.target.value);
                      setCoursePage(1);
                    }}
                  />
                </div>
                <div className="input-group input-group-sm" style={{ width: '170px' }}>
                  <span className="input-group-text bg-white border-end-0 text-muted"><FiFilter /></span>
                  <select
                    className="form-select form-premium py-1 ps-1 border-start-0"
                    value={courseFilter}
                    onChange={(e) => {
                      setCourseFilter(e.target.value);
                      setCoursePage(1);
                    }}
                  >
                    <option value="All">All Difficulties</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Courses Responsive Cards Grid */}
            {coursesLoading ? (
              <div className="row g-3">
                {[1, 2, 3].map(n => (
                  <div className="col-md-4 col-sm-6" key={n}>
                    <div className="card h-100 bg-light p-3" style={{ minHeight: '260px' }}>
                      <div className="skeleton-loader mb-3" style={{ height: '100px', background: '#e2e8f0', borderRadius: '8px' }}></div>
                      <div className="skeleton-loader mb-2" style={{ height: '16px', width: '70%', background: '#e2e8f0', borderRadius: '4px' }}></div>
                      <div className="skeleton-loader" style={{ height: '14px', width: '50%', background: '#e2e8f0', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : currentCourses.length === 0 ? (
              <div className="text-center py-5 border border-dashed rounded my-3">
                <FiInfo size={28} className="text-muted mb-2" />
                <h5 className="text-secondary fw-semibold">No courses listed in catalog.</h5>
                <p className="text-muted small">Try modifying search tags or add new resources.</p>
              </div>
            ) : (
              <div className="row g-3">
                {currentCourses.map(course => (
                  <div className="col-md-4 col-sm-6 animate-card-appear" key={course.id}>
                    <div className="card h-100 bg-white border border-light hover-premium-card p-3 d-flex flex-column" style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', borderRadius: '14px' }}>
                      
                      {/* Top Header Card Info */}
                      <div className="d-flex align-items-center gap-3 mb-3">
                        {getCourseIcon(course.tags)}
                        <div style={{ minWidth: 0 }}>
                          <h6 className="fw-bold mb-1 text-truncate text-gradient-primary" style={{ cursor: 'pointer' }} onClick={() => handleVisitCourse(course)} title="Visit course link">
                            {course.title}
                          </h6>
                          <div className="text-muted small text-truncate" style={{ fontSize: '0.8rem' }}>By {course.instructor}</div>
                        </div>
                      </div>

                      {/* Course Metadata badges */}
                      <div className="mb-2 d-flex flex-wrap gap-2">
                        <span className={`badge ${
                          course.difficultyLevel === 'Beginner' ? 'bg-success bg-opacity-10 text-success border border-success border-opacity-10' :
                          course.difficultyLevel === 'Intermediate' ? 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-10' :
                          'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-10'
                        } small`}>
                          {course.difficultyLevel}
                        </span>
                        <span className="badge bg-light text-secondary border border-light small">{course.platform}</span>
                      </div>

                      {/* Rating details */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="text-warning small d-flex align-items-center gap-1">
                          <FiStar fill="currentColor" size={13} />
                          <span className="fw-semibold text-dark">{course.rating ? course.rating.toFixed(1) : '4.5'}</span>
                        </div>
                        <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                          Clicks: <strong className="text-primary">{course.clickCount || 0}</strong>
                        </div>
                      </div>

                      <p className="text-muted small flex-grow-1 mb-3" style={{ fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                        {course.description}
                      </p>

                      {/* Tags pills */}
                      <div className="d-flex flex-wrap gap-1 mb-3">
                        {course.tags.split(',').map(tag => (
                          <span key={tag} className="badge bg-light text-muted border border-light small" style={{ fontSize: '0.7rem' }}>
                            {tag.trim()}
                          </span>
                        ))}
                      </div>

                      {/* Action buttons footer */}
                      <div className="d-flex gap-2 pt-2 border-top border-light mt-auto">
                        <button 
                          className="btn btn-sm btn-premium-primary flex-grow-1 d-inline-flex align-items-center justify-content-center" 
                          onClick={() => handleVisitCourse(course)}
                        >
                          <FiExternalLink className="me-1" /> Visit Course
                        </button>
                        <button 
                          className="btn btn-sm btn-premium-outline px-2 py-1"
                          onClick={() => setSelectedCourseDetails(course)}
                          title="View Syllabus Details"
                        >
                          <FiEye />
                        </button>
                        <button className="btn btn-sm btn-outline-warning px-2 py-1" title="Edit course" onClick={() => handleEditCourse(course)}>
                          <FiEdit2 size={13} />
                        </button>
                        <button className="btn btn-sm btn-outline-danger px-2 py-1" title="Delete course" onClick={() => handleDeleteCourse(course.id)}>
                          <FiTrash2 size={13} />
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination for Course Grid */}
            {totalCoursePages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top border-light">
                <span className="small text-muted">Showing page {coursePage} of {totalCoursePages}</span>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-sm btn-premium-outline px-3"
                    disabled={coursePage === 1}
                    onClick={() => setCoursePage(coursePage - 1)}
                  >
                    Previous
                  </button>
                  <button 
                    className="btn btn-sm btn-premium-outline px-3"
                    disabled={coursePage === totalCoursePages}
                    onClick={() => setCoursePage(coursePage + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Registered Accounts Table (Light Styled Table) */}
      <div className="row g-4 mb-5">
        <div className="col-lg-12">
          <div className="card glass-card p-4 shadow-sm">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
              <h4 className="fw-bold mb-0 d-flex align-items-center text-gradient-primary">
                <FiUsers className="me-2" />
                Registered Accounts Directory
              </h4>
              <div className="d-flex align-items-center gap-2">
                <div className="input-group input-group-sm" style={{ width: '250px' }}>
                  <span className="input-group-text bg-white border-end-0 text-muted"><FiSearch /></span>
                  <input
                    type="text"
                    className="form-control form-premium ps-1 border-start-0"
                    placeholder="Search accounts..."
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setUserPage(1);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ color: 'var(--text-main)' }}>
                <thead style={{ background: 'var(--bg-glass-hover)', borderBottom: '1.5px solid var(--border-color)' }}>
                  <tr className="text-muted small fw-bold">
                    <th>User Email</th>
                    <th>Role</th>
                    <th>Created Date</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">No accounts match criteria.</td>
                    </tr>
                  ) : (
                    currentUsers.map(user => (
                      <tr key={user.id} className="border-bottom border-light">
                        <td className="small text-dark fw-semibold">{user.email}</td>
                        <td>
                          <span className={`badge ${
                            user.role === 'ADMIN' ? 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-10' :
                            user.role === 'STUDENT' ? 'bg-success bg-opacity-10 text-success border border-success border-opacity-10' :
                            user.role === 'MENTOR' ? 'bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10' :
                            'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-10'
                          } small`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="small text-muted">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() + ' ' + new Date(user.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A'}</td>
                        <td>
                          <span className={`badge ${user.active ? 'bg-success bg-opacity-15 text-success' : 'bg-secondary bg-opacity-15 text-muted'}`}>
                            {user.active ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="text-end">
                          {user.role !== 'ADMIN' ? (
                            <button 
                              className="btn btn-sm btn-outline-danger d-inline-flex align-items-center"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <FiTrash2 className="me-1" /> Delete
                            </button>
                          ) : (
                            <span className="text-muted small">Default Admin</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination for Accounts */}
            {totalUserPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-light">
                <span className="small text-muted">Showing page {userPage} of {totalUserPages}</span>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-sm btn-premium-outline px-3"
                    disabled={userPage === 1}
                    onClick={() => setUserPage(userPage - 1)}
                  >
                    Previous
                  </button>
                  <button 
                    className="btn btn-sm btn-premium-outline px-3"
                    disabled={userPage === totalUserPages}
                    onClick={() => setUserPage(userPage + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vacancy & Placement Moderation (Light Styled Table) */}
      <div className="row g-4">
        <div className="col-lg-12">
          <div className="card glass-card p-4 shadow-sm">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
              <div>
                <h4 className="fw-bold mb-1 d-flex align-items-center text-gradient-primary">
                  <FiBriefcase className="me-2" />
                  Vacancy &amp; Placement Moderation
                </h4>
                <p className="text-muted small mb-0">List of all positions posted by recruiters. Moderate status flags or delete listings.</p>
              </div>

              <div className="d-flex flex-wrap gap-2 align-items-center">
                <div className="input-group input-group-sm" style={{ width: '200px' }}>
                  <span className="input-group-text bg-white border-end-0 text-muted"><FiSearch /></span>
                  <input
                    type="text"
                    className="form-control form-premium ps-1 border-start-0"
                    placeholder="Search postings..."
                    value={modSearch}
                    onChange={(e) => {
                      setModSearch(e.target.value);
                      setModPage(1);
                    }}
                  />
                </div>
                <div className="input-group input-group-sm" style={{ width: '130px' }}>
                  <span className="input-group-text bg-white border-end-0 text-muted"><FiFilter /></span>
                  <select
                    className="form-select form-premium ps-1 border-start-0"
                    value={modTypeFilter}
                    onChange={(e) => {
                      setModTypeFilter(e.target.value);
                      setModPage(1);
                    }}
                  >
                    <option value="All">All Types</option>
                    <option value="Job">Jobs</option>
                    <option value="Internship">Internships</option>
                  </select>
                </div>
                <div className="input-group input-group-sm" style={{ width: '140px' }}>
                  <span className="input-group-text bg-white border-end-0 text-muted"><FiFilter /></span>
                  <select
                    className="form-select form-premium ps-1 border-start-0"
                    value={modStatusFilter}
                    onChange={(e) => {
                      setModStatusFilter(e.target.value);
                      setModPage(1);
                    }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="PENDING">PENDING</option>
                    <option value="DEACTIVATED">DEACTIVATED</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ color: 'var(--text-main)' }}>
                <thead style={{ background: 'var(--bg-glass-hover)', borderBottom: '1.5px solid var(--border-color)' }}>
                  <tr className="text-muted small fw-bold">
                    <th>Title</th>
                    <th>Company</th>
                    <th>Recruiter</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Posted Date</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentListings.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-muted">No vacancies found.</td>
                    </tr>
                  ) : (
                    currentListings.map(item => {
                      const statusVal = item.status || 'ACTIVE';
                      return (
                        <tr key={item.keyId} className="border-bottom border-light">
                          <td className="fw-bold text-dark">{item.title}</td>
                          <td className="small fw-semibold">{item.companyName}</td>
                          <td className="small text-muted">{item.recruiterName || `ID: ${item.recruiterId}`}</td>
                          <td className="small">{item.location}</td>
                          <td>
                            <span className={`badge ${item.type === 'Job' ? 'bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10' : 'bg-info bg-opacity-10 text-info border border-info border-opacity-10'} small`}>
                              {item.type}
                            </span>
                          </td>
                          <td>
                            <select
                              className={`form-select form-select-sm form-premium py-0 px-2 fw-semibold d-inline-block ${
                                statusVal === 'ACTIVE' ? 'text-success border-success bg-success bg-opacity-5' :
                                statusVal === 'PENDING' ? 'text-warning border-warning bg-warning bg-opacity-5' : 'text-danger border-danger bg-danger bg-opacity-5'
                              }`}
                              style={{ width: 'auto', display: 'inline', backgroundPosition: 'right 0.35rem center', fontSize: '0.8rem', paddingRight: '1.5rem' }}
                              value={statusVal}
                              onChange={(e) => handleModerateStatus(item.id, item.type, e.target.value)}
                            >
                              <option value="ACTIVE" className="text-success fw-bold">ACTIVE</option>
                              <option value="PENDING" className="text-warning fw-bold">PENDING</option>
                              <option value="DEACTIVATED" className="text-danger fw-bold">DEACTIVATED</option>
                            </select>
                          </td>
                          <td className="small text-muted">
                            {item.postedDate ? new Date(item.postedDate).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="text-end">
                            <div className="d-flex justify-content-end gap-2">
                              <button 
                                className="btn btn-sm btn-outline-info d-inline-flex align-items-center py-1 px-2"
                                onClick={() => setSelectedListingDetails(item)}
                              >
                                <FiEye className="me-1" /> View
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger d-inline-flex align-items-center py-1 px-2"
                                onClick={() => handleDeleteListing(item.id, item.type === 'Internship')}
                              >
                                <FiTrash2 className="me-1" /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination for Listings */}
            {totalModPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-light">
                <span className="small text-muted">Showing page {modPage} of {totalModPages}</span>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-sm btn-premium-outline px-3"
                    disabled={modPage === 1}
                    onClick={() => setModPage(modPage - 1)}
                  >
                    Previous
                  </button>
                  <button 
                    className="btn btn-sm btn-premium-outline px-3"
                    disabled={modPage === totalModPages}
                    onClick={() => setModPage(modPage + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Details Modal Overlay */}
      {selectedCourseDetails && (
        <div className="custom-modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 1050, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '15px'
        }}>
          <div className="card glass-card p-4 border border-light shadow-lg" style={{ maxWidth: '600px', width: '100%', background: '#ffffff' }}>
            <div className="d-flex justify-content-between align-items-start mb-3 border-bottom border-light pb-2">
              <h4 className="fw-bold text-gradient-primary mb-0">{selectedCourseDetails.title}</h4>
              <button className="btn btn-sm btn-link text-muted p-0 fs-4" onClick={() => setSelectedCourseDetails(null)}>&times;</button>
            </div>
            <div className="mb-3 text-dark">
              <div className="d-flex gap-2 mb-3">
                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10">{selectedCourseDetails.difficultyLevel}</span>
                <span className="badge bg-light text-secondary border border-light">{selectedCourseDetails.platform}</span>
              </div>
              <p className="text-muted small mb-1"><strong>Instructor:</strong> {selectedCourseDetails.instructor}</p>
              <p className="text-muted small mb-1"><strong>Platform Partner:</strong> {selectedCourseDetails.platform}</p>
              <p className="text-muted small mb-1"><strong>Overall Rating:</strong> &#9733; {selectedCourseDetails.rating.toFixed(1)}</p>
              <p className="text-muted small mb-1"><strong>Click Analytics Count:</strong> {selectedCourseDetails.clickCount || 0}</p>
              <p className="text-muted small mb-3"><strong>Target Skills Mapped:</strong> {selectedCourseDetails.tags}</p>
              <div className="mt-2 text-secondary small p-3 bg-light rounded" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                <strong>Course Roadmap Details:</strong><br/>
                {selectedCourseDetails.description}
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2 pt-2 border-top border-light">
              <button className="btn btn-premium-primary px-3 py-2" onClick={() => handleVisitCourse(selectedCourseDetails)}>Visit &amp; Enroll</button>
              <button className="btn btn-premium-outline px-3 py-2" onClick={() => setSelectedCourseDetails(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Vacancy details Modal Overlay */}
      {selectedListingDetails && (
        <div className="custom-modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 1050, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '15px'
        }}>
          <div className="card glass-card p-4 border border-light shadow-lg" style={{ maxWidth: '600px', width: '100%', background: '#ffffff' }}>
            <div className="d-flex justify-content-between align-items-start mb-3 border-bottom border-light pb-2">
              <h4 className="fw-bold text-gradient-primary mb-0">{selectedListingDetails.title}</h4>
              <button className="btn btn-sm btn-link text-muted p-0 fs-4" onClick={() => setSelectedListingDetails(null)}>&times;</button>
            </div>
            <div className="mb-3 text-dark">
              <div className="d-flex gap-2 mb-3">
                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10">{selectedListingDetails.type}</span>
                <span className="badge bg-light text-muted border border-light">{selectedListingDetails.status || 'ACTIVE'}</span>
              </div>
              <p className="text-muted small mb-1"><strong>Company Name:</strong> {selectedListingDetails.companyName}</p>
              <p className="text-muted small mb-1"><strong>Location:</strong> {selectedListingDetails.location}</p>
              <p className="text-muted small mb-1"><strong>Recruiter Contact:</strong> {selectedListingDetails.recruiterName || `ID: ${selectedListingDetails.recruiterId}`}</p>
              {selectedListingDetails.type === 'Job' ? (
                <p className="text-muted small mb-1"><strong>Salary Package:</strong> {selectedListingDetails.salaryRange || 'N/A'}</p>
              ) : (
                <>
                  <p className="text-muted small mb-1"><strong>Monthly Stipend:</strong> {selectedListingDetails.stipend || 'N/A'}</p>
                  <p className="text-muted small mb-1"><strong>Internship Duration:</strong> {selectedListingDetails.durationMonths} months</p>
                </>
              )}
              <p className="text-muted small mb-3"><strong>Required Skillsets:</strong> {Array.from(selectedListingDetails.requiredSkills || []).join(', ')}</p>
              <div className="mt-2 text-secondary small p-3 bg-light rounded" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                <strong>Role Description:</strong><br/>
                {selectedListingDetails.description}
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2 pt-2 border-top border-light">
              <button className="btn btn-premium-outline px-3 py-2" onClick={() => setSelectedListingDetails(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
