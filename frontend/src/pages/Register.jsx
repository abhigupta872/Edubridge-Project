import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { FiUser, FiMail, FiLock, FiPhone, FiInfo, FiCheckCircle, FiAlertCircle, FiEye, FiEyeOff, FiCheck, FiChevronRight } from 'react-icons/fi';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('STUDENT');
  const [showPassword, setShowPassword] = useState(false);
  
  // Form Data
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Role specific optional fields
  const [currentEducation, setCurrentEducation] = useState('');
  const [institution, setInstitution] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [company, setCompany] = useState('');
  const [designation, setDesignation] = useState('');
  const [expertise, setExpertise] = useState('');
  const [companyName, setCompanyName] = useState('');

  // UI & Validation States
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  // Password Strength State
  const [strength, setStrength] = useState({ score: 0, label: 'Very Weak', color: 'bg-danger' });
  const [pwdChecks, setPwdChecks] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  // Check password strength
  useEffect(() => {
    const checks = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPwdChecks(checks);

    let score = 0;
    if (password.length > 0) {
      if (checks.length) score += 1;
      if (checks.upper && checks.lower) score += 1;
      if (checks.number) score += 1;
      if (checks.special) score += 1;
    }

    let label = 'Very Weak';
    let color = 'bg-danger';

    if (score === 1) {
      label = 'Weak';
      color = 'bg-danger';
    } else if (score === 2) {
      label = 'Fair';
      color = 'bg-warning';
    } else if (score === 3) {
      label = 'Good';
      color = 'bg-info';
    } else if (score === 4) {
      label = 'Strong';
      color = 'bg-success';
    }

    setStrength({ score, label, color });
  }, [password]);

  // Real-time Validation
  const validateField = (name, value) => {
    let error = '';
    
    if (name === 'fullName') {
      if (!value.trim()) {
        error = 'Full Name is required.';
      } else if (value.trim().split(' ').length < 2) {
        error = 'Please enter both first and last name.';
      }
    }
    
    if (name === 'email') {
      if (!value) {
        error = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'Please enter a valid email address.';
      }
    }

    if (name === 'phone') {
      if (!value) {
        error = 'Mobile number is required.';
      } else if (!/^[0-9]{10,15}$/.test(value)) {
        error = 'Please enter a valid mobile number (10-15 digits).';
      }
    }

    if (name === 'password') {
      if (!value) {
        error = 'Password is required.';
      } else {
        const hasMinLength = value.length >= 8;
        const hasUpper = /[A-Z]/.test(value);
        const hasLower = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        
        if (!hasMinLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
          error = 'Password must meet all strength requirements.';
        }
      }
    }

    if (name === 'confirmPassword') {
      if (!value) {
        error = 'Please confirm your password.';
      } else if (value !== password) {
        error = 'Passwords do not match.';
      }
    }

    if (name === 'terms') {
      if (!value) {
        error = 'You must accept the terms and conditions.';
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'fullName') validateField('fullName', fullName);
    if (field === 'email') validateField('email', email);
    if (field === 'phone') validateField('phone', phone);
    if (field === 'password') validateField('password', password);
    if (field === 'confirmPassword') validateField('confirmPassword', confirmPassword);
  };

  const handleInputChange = (field, val, setter) => {
    setter(val);
    if (touched[field]) {
      validateField(field, val);
    }
    // Cross-validate confirm password if password changes
    if (field === 'password' && touched.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: confirmPassword !== val ? 'Passwords do not match.' : ''
      }));
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Touch all fields
    const allTouched = {
      fullName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      terms: true,
    };
    setTouched(allTouched);

    // Run validation on all fields
    validateField('fullName', fullName);
    validateField('email', email);
    validateField('phone', phone);
    validateField('password', password);
    validateField('confirmPassword', confirmPassword);
    validateField('terms', termsAccepted);

    // Check if there are errors
    const hasErrors = 
      !fullName.trim() || 
      !email || 
      !phone || 
      !password || 
      confirmPassword !== password ||
      !termsAccepted ||
      errors.fullName || 
      errors.email || 
      errors.phone || 
      errors.password || 
      errors.confirmPassword;

    if (hasErrors) {
      setApiError('Please resolve all validation errors in the form.');
      return;
    }

    setLoading(true);

    // Split Full Name into First and Last
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '.'; // fallback last name if only one name entered

    // Prepare payload
    const payload = {
      email,
      password,
      role,
      firstName,
      lastName,
      phone,
      bio: `Registered as ${role} on EduBridge.`,
    };

    // Role-specific additions
    if (role === 'STUDENT') {
      payload.currentEducation = currentEducation || null;
      payload.institution = institution || null;
      payload.graduationYear = graduationYear ? parseInt(graduationYear) : null;
    } else if (role === 'MENTOR') {
      payload.company = company || null;
      payload.designation = designation || null;
      payload.expertise = expertise || null;
    } else if (role === 'RECRUITER') {
      payload.companyName = companyName || null;
      payload.designation = designation || null;
    }

    try {
      await api.post('/auth/register', payload);
      setSuccess(true);
      // Wait for the success animation, then redirect to login
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setApiError(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Registration failed. The email may already be registered.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 animate-fade-in" style={{ minHeight: '90vh' }}>
      <div className="card glass-card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px' }}>
        <div className="row g-0">
          
          {/* Left Side Column: Premium Illustration (Hidden on mobile) */}
          <div className="col-lg-5 d-none d-lg-flex flex-column justify-content-center align-items-center p-5 text-white position-relative" 
               style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}>
            
            {/* Soft decorative background circles */}
            <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden" style={{ zIndex: 0, opacity: 0.15 }}>
              <div className="position-absolute rounded-circle bg-white" style={{ width: '300px', height: '300px', top: '-100px', left: '-100px' }}></div>
              <div className="position-absolute rounded-circle bg-white" style={{ width: '200px', height: '200px', bottom: '-50px', right: '-50px' }}></div>
            </div>

            <div className="text-center position-relative mb-4" style={{ zIndex: 1 }}>
              <h2 className="fw-bold mb-3">Bridge Your Skills</h2>
              <p className="lead text-white-50">Join thousands of students, mentors, and recruiters on the ultimate talent readiness platform.</p>
            </div>

            {/* Vector Illustration */}
            <div className="w-100 text-center position-relative mb-4" style={{ zIndex: 1, maxWidth: '340px' }}>
              <svg viewBox="0 0 500 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                {/* Background platform */}
                <ellipse cx="250" cy="420" rx="180" ry="30" fill="rgba(0, 0, 0, 0.2)" />
                
                {/* Laptop device */}
                <rect x="110" y="240" width="280" height="170" rx="10" fill="#e2e8f0" stroke="#475569" strokeWidth="6" />
                <rect x="125" y="255" width="250" height="140" rx="4" fill="#0f172a" />
                <path d="M90 410h320v10a10 10 0 0 1-10 10H100a10 10 0 0 1-10-10v-10z" fill="#cbd5e1" stroke="#475569" strokeWidth="4" />
                <path d="M220 410h60v6h-60v-6z" fill="#94a3b8" />
                
                {/* Screen content (Dashboard mock) */}
                {/* Graph */}
                <path d="M150 360 l40-30 30 15 50-50 40 25 30-45" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
                <circle cx="150" cy="360" r="4" fill="#ffffff" />
                <circle cx="190" cy="330" r="4" fill="#ffffff" />
                <circle cx="220" cy="345" r="4" fill="#ffffff" />
                <circle cx="270" cy="295" r="4" fill="#ffffff" />
                <circle cx="310" cy="320" r="4" fill="#ffffff" />
                <circle cx="340" cy="275" r="4" fill="#ffffff" />
                
                {/* Floating Course Cards */}
                {/* Card 1: Web Dev */}
                <g transform="translate(60, 80)" opacity="0.95">
                  <rect x="0" y="0" width="130" height="80" rx="12" fill="#ffffff" filter="drop-shadow(0px 8px 16px rgba(0,0,0,0.15))" />
                  <rect x="12" y="12" width="32" height="32" rx="8" fill="rgba(37,99,235,0.1)" />
                  <path d="M22 24l3 3 5-5" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <rect x="52" y="16" width="65" height="8" rx="4" fill="#94a3b8" />
                  <rect x="52" y="30" width="45" height="6" rx="3" fill="#cbd5e1" />
                  <rect x="12" y="56" width="105" height="12" rx="6" fill="#7c3aed" />
                </g>

                {/* Card 2: AI / ML */}
                <g transform="translate(300, 140)" opacity="0.95">
                  <rect x="0" y="0" width="140" height="90" rx="12" fill="#ffffff" filter="drop-shadow(0px 8px 16px rgba(0,0,0,0.15))" />
                  <rect x="12" y="12" width="32" height="32" rx="8" fill="rgba(34,197,94,0.1)" />
                  <circle cx="28" cy="28" r="6" stroke="#22c55e" strokeWidth="2" fill="none" />
                  <rect x="52" y="16" width="75" height="8" rx="4" fill="#94a3b8" />
                  <rect x="52" y="30" width="55" height="6" rx="3" fill="#cbd5e1" />
                  <circle cx="22" cy="68" r="8" fill="#e2e8f0" />
                  <circle cx="42" cy="68" r="8" fill="#e2e8f0" />
                  <circle cx="62" cy="68" r="8" fill="#e2e8f0" />
                  <rect x="95" y="62" width="33" height="12" rx="6" fill="#2563eb" />
                </g>

                {/* Floating Badges */}
                <g transform="translate(230, 40)" opacity="0.9">
                  <circle cx="25" cy="25" r="25" fill="#f59e0b" />
                  <path d="M25 13l3.5 7 7.5 1-5.5 5.5 1.5 7.5-7-3.5-7 3.5 1.5-7.5-5.5-5.5 7.5-1z" fill="#ffffff" />
                </g>
                
                <g transform="translate(60, 270)">
                  <rect x="0" y="0" width="70" height="35" rx="8" fill="#ffffff" filter="drop-shadow(0px 4px 8px rgba(0,0,0,0.1))" />
                  <text x="35" y="22" fontFamily="Poppins" fontSize="11" fontWeight="bold" fill="#1e293b" textAnchor="middle">100%</text>
                </g>
              </svg>
            </div>

            <div className="text-center position-relative mt-2" style={{ zIndex: 1 }}>
              <div className="d-flex justify-content-center gap-2 mb-3">
                <span className="badge rounded-pill px-3 py-2 bg-white bg-opacity-20 text-white small">Expert Mentors</span>
                <span className="badge rounded-pill px-3 py-2 bg-white bg-opacity-20 text-white small">Placement Pipelines</span>
              </div>
            </div>
          </div>

          {/* Right Side Column: Form */}
          <div className="col-lg-7 p-4 p-md-5 bg-white">
            
            {/* If successfully registered, show drawing checkmark */}
            {success ? (
              <div className="text-center py-5 my-4 animate-fade-in">
                <div className="success-checkmark">
                  <div className="check-icon">
                    <span className="icon-line line-tip"></span>
                    <span className="icon-line line-long"></span>
                    <div className="icon-circle"></div>
                    <div className="icon-fix"></div>
                  </div>
                </div>
                <h3 className="fw-bold text-dark mt-4 mb-2">Registration Successful!</h3>
                <p className="text-muted">Welcome to EduBridge. Redirecting to the login page...</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <h3 className="fw-bold text-dark mb-1">Create Account</h3>
                  <p className="text-muted">Fill in your details to start bridging your career gap.</p>
                </div>

                {/* API Error Alert */}
                {apiError && (
                  <div className="alert alert-danger d-flex align-items-center border-0 py-3 px-3 mb-4 animate-fade-in" role="alert" style={{ background: 'rgba(239, 68, 68, 0.08)', color: 'var(--danger)', borderRadius: '12px' }}>
                    <FiAlertCircle className="me-2 flex-shrink-0" size={20} />
                    <div className="small fw-medium">{apiError}</div>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} noValidate>
                  
                  {/* Role Selector Pill */}
                  <div className="mb-4">
                    <label className="form-label text-muted small fw-medium d-block mb-2">Select Platform Role</label>
                    <div className="d-flex p-1 bg-light rounded-3" style={{ maxWidth: '380px' }}>
                      <button
                        type="button"
                        className={`btn flex-grow-1 border-0 py-2 rounded-3 text-center small fw-semibold transition-all ${role === 'STUDENT' ? 'bg-white text-primary shadow-sm' : 'text-muted'}`}
                        onClick={() => setRole('STUDENT')}
                      >
                        Student
                      </button>
                      <button
                        type="button"
                        className={`btn flex-grow-1 border-0 py-2 rounded-3 text-center small fw-semibold transition-all ${role === 'MENTOR' ? 'bg-white text-primary shadow-sm' : 'text-muted'}`}
                        onClick={() => setRole('MENTOR')}
                      >
                        Mentor
                      </button>
                      <button
                        type="button"
                        className={`btn flex-grow-1 border-0 py-2 rounded-3 text-center small fw-semibold transition-all ${role === 'RECRUITER' ? 'bg-white text-primary shadow-sm' : 'text-muted'}`}
                        onClick={() => setRole('RECRUITER')}
                      >
                        Recruiter
                      </button>
                    </div>
                  </div>

                  {/* Core Form Fields */}
                  <div className="row">
                    {/* Full Name */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="fullName" className="form-label text-dark fw-medium small mb-2">Full Name</label>
                      <div className="input-group">
                        <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: errors.fullName && touched.fullName ? 'var(--danger)' : 'var(--border-color)' }}>
                          <FiUser />
                        </span>
                        <input
                          type="text"
                          id="fullName"
                          className={`form-control form-premium border-start-0 ${errors.fullName && touched.fullName ? 'is-invalid border-danger' : ''}`}
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value, setFullName)}
                          onBlur={() => handleBlur('fullName')}
                          required
                        />
                      </div>
                      {errors.fullName && touched.fullName && (
                        <div className="text-danger small mt-1 d-flex align-items-center">
                          <FiAlertCircle className="me-1" size={14} /> {errors.fullName}
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label text-dark fw-medium small mb-2">Email Address</label>
                      <div className="input-group">
                        <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: errors.email && touched.email ? 'var(--danger)' : 'var(--border-color)' }}>
                          <FiMail />
                        </span>
                        <input
                          type="email"
                          id="email"
                          className={`form-control form-premium border-start-0 ${errors.email && touched.email ? 'is-invalid border-danger' : ''}`}
                          placeholder="john@example.com"
                          value={email}
                          onChange={(e) => handleInputChange('email', e.target.value, setEmail)}
                          onBlur={() => handleBlur('email')}
                          required
                        />
                      </div>
                      {errors.email && touched.email && (
                        <div className="text-danger small mt-1 d-flex align-items-center">
                          <FiAlertCircle className="me-1" size={14} /> {errors.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    {/* Mobile Number */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="phone" className="form-label text-dark fw-medium small mb-2">Mobile Number</label>
                      <div className="input-group">
                        <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: errors.phone && touched.phone ? 'var(--danger)' : 'var(--border-color)' }}>
                          <FiPhone />
                        </span>
                        <input
                          type="tel"
                          id="phone"
                          className={`form-control form-premium border-start-0 ${errors.phone && touched.phone ? 'is-invalid border-danger' : ''}`}
                          placeholder="9876543210"
                          value={phone}
                          onChange={(e) => handleInputChange('phone', e.target.value, setPhone)}
                          onBlur={() => handleBlur('phone')}
                          required
                        />
                      </div>
                      {errors.phone && touched.phone && (
                        <div className="text-danger small mt-1 d-flex align-items-center">
                          <FiAlertCircle className="me-1" size={14} /> {errors.phone}
                        </div>
                      )}
                    </div>

                    {/* Gender (Optional) */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="gender" className="form-label text-dark fw-medium small mb-2">Gender <span className="text-muted">(Optional)</span></label>
                      <select
                        id="gender"
                        className="form-select form-premium"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="">Choose Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="PreferNotToSay">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    {/* Password */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="password" className="form-label text-dark fw-medium small mb-2">Password</label>
                      <div className="input-group position-relative">
                        <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: errors.password && touched.password ? 'var(--danger)' : 'var(--border-color)' }}>
                          <FiLock />
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          className={`form-control form-premium border-start-0 ${errors.password && touched.password ? 'is-invalid border-danger' : ''}`}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => handleInputChange('password', e.target.value, setPassword)}
                          onBlur={() => handleBlur('password')}
                          required
                        />
                        <button
                          type="button"
                          className="btn bg-transparent position-absolute end-0 top-50 translate-middle-y border-0 text-muted pe-3"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ zIndex: 10 }}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
                      {errors.password && touched.password && (
                        <div className="text-danger small mt-1 d-flex align-items-center">
                          <FiAlertCircle className="me-1" size={14} /> {errors.password}
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="col-md-6 mb-3">
                      <label htmlFor="confirmPassword" className="form-label text-dark fw-medium small mb-2">Confirm Password</label>
                      <div className="input-group">
                        <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: errors.confirmPassword && touched.confirmPassword ? 'var(--danger)' : 'var(--border-color)' }}>
                          <FiLock />
                        </span>
                        <input
                          type="password"
                          id="confirmPassword"
                          className={`form-control form-premium border-start-0 ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid border-danger' : ''}`}
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value, setConfirmPassword)}
                          onBlur={() => handleBlur('confirmPassword')}
                          required
                        />
                      </div>
                      {errors.confirmPassword && touched.confirmPassword && (
                        <div className="text-danger small mt-1 d-flex align-items-center">
                          <FiAlertCircle className="me-1" size={14} /> {errors.confirmPassword}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Password Strength Indicator */}
                  {password.length > 0 && (
                    <div className="mb-4 p-3 rounded-3 bg-light animate-fade-in border">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small fw-semibold text-dark">Password Strength:</span>
                        <span className={`badge ${strength.color} text-white`}>{strength.label}</span>
                      </div>
                      <div className="progress rounded-pill mb-3" style={{ height: '6px' }}>
                        <div 
                          className={`progress-bar rounded-pill ${strength.color}`} 
                          role="progressbar" 
                          style={{ width: `${(strength.score / 4) * 100}%` }}
                          aria-valuenow={strength.score} 
                          aria-valuemin="0" 
                          aria-valuemax="4"
                        ></div>
                      </div>
                      
                      {/* Detailed Requirements Checklist */}
                      <div className="row g-2">
                        <div className="col-6 d-flex align-items-center text-muted" style={{ fontSize: '0.78rem' }}>
                          <span className={`me-2 rounded-circle d-inline-flex align-items-center justify-content-center ${pwdChecks.length ? 'bg-success text-white' : 'bg-secondary bg-opacity-10'}`} style={{ width: '14px', height: '14px' }}>
                            {pwdChecks.length ? <FiCheck size={10} /> : null}
                          </span>
                          <span>Min 8 characters</span>
                        </div>
                        <div className="col-6 d-flex align-items-center text-muted" style={{ fontSize: '0.78rem' }}>
                          <span className={`me-2 rounded-circle d-inline-flex align-items-center justify-content-center ${pwdChecks.upper ? 'bg-success text-white' : 'bg-secondary bg-opacity-10'}`} style={{ width: '14px', height: '14px' }}>
                            {pwdChecks.upper ? <FiCheck size={10} /> : null}
                          </span>
                          <span>Uppercase letter (A-Z)</span>
                        </div>
                        <div className="col-6 d-flex align-items-center text-muted" style={{ fontSize: '0.78rem' }}>
                          <span className={`me-2 rounded-circle d-inline-flex align-items-center justify-content-center ${pwdChecks.lower ? 'bg-success text-white' : 'bg-secondary bg-opacity-10'}`} style={{ width: '14px', height: '14px' }}>
                            {pwdChecks.lower ? <FiCheck size={10} /> : null}
                          </span>
                          <span>Lowercase letter (a-z)</span>
                        </div>
                        <div className="col-6 d-flex align-items-center text-muted" style={{ fontSize: '0.78rem' }}>
                          <span className={`me-2 rounded-circle d-inline-flex align-items-center justify-content-center ${pwdChecks.number ? 'bg-success text-white' : 'bg-secondary bg-opacity-10'}`} style={{ width: '14px', height: '14px' }}>
                            {pwdChecks.number ? <FiCheck size={10} /> : null}
                          </span>
                          <span>Numeric digit (0-9)</span>
                        </div>
                        <div className="col-6 d-flex align-items-center text-muted" style={{ fontSize: '0.78rem' }}>
                          <span className={`me-2 rounded-circle d-inline-flex align-items-center justify-content-center ${pwdChecks.special ? 'bg-success text-white' : 'bg-secondary bg-opacity-10'}`} style={{ width: '14px', height: '14px' }}>
                            {pwdChecks.special ? <FiCheck size={10} /> : null}
                          </span>
                          <span>Special character (!@#...)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Optional Role-Based Collapsible Fields */}
                  <div className="card border border-secondary-subtle rounded-3 p-3 mb-4 bg-light bg-opacity-20 animate-fade-in">
                    <div className="fw-semibold text-dark small mb-3 d-flex align-items-center">
                      <FiInfo className="text-primary me-1" />
                      <span>{role.charAt(0) + role.slice(1).toLowerCase()} Profile Details <span className="text-muted font-normal">(Optional)</span></span>
                    </div>

                    {role === 'STUDENT' && (
                      <div className="row g-2">
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control form-premium py-2 text-sm"
                            placeholder="Current Degree (e.g., B.Tech)"
                            value={currentEducation}
                            onChange={(e) => setCurrentEducation(e.target.value)}
                            style={{ fontSize: '0.85rem' }}
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="number"
                            className="form-control form-premium py-2 text-sm"
                            placeholder="Graduation Year (e.g., 2027)"
                            value={graduationYear}
                            onChange={(e) => setGraduationYear(e.target.value)}
                            style={{ fontSize: '0.85rem' }}
                          />
                        </div>
                        <div className="col-12 mt-2">
                          <input
                            type="text"
                            className="form-control form-premium py-2 text-sm"
                            placeholder="Institution / University Name"
                            value={institution}
                            onChange={(e) => setInstitution(e.target.value)}
                            style={{ fontSize: '0.85rem' }}
                          />
                        </div>
                      </div>
                    )}

                    {role === 'MENTOR' && (
                      <div className="row g-2">
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control form-premium py-2 text-sm"
                            placeholder="Current Company (e.g., Google)"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            style={{ fontSize: '0.85rem' }}
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control form-premium py-2 text-sm"
                            placeholder="Designation (e.g., Senior Engineer)"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            style={{ fontSize: '0.85rem' }}
                          />
                        </div>
                        <div className="col-12 mt-2">
                          <input
                            type="text"
                            className="form-control form-premium py-2 text-sm"
                            placeholder="Expertise Skills (comma separated, e.g. Java, React)"
                            value={expertise}
                            onChange={(e) => setExpertise(e.target.value)}
                            style={{ fontSize: '0.85rem' }}
                          />
                        </div>
                      </div>
                    )}

                    {role === 'RECRUITER' && (
                      <div className="row g-2">
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control form-premium py-2 text-sm"
                            placeholder="Hiring Company Name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            style={{ fontSize: '0.85rem' }}
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type="text"
                            className="form-control form-premium py-2 text-sm"
                            placeholder="Designation (e.g., HR Lead)"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            style={{ fontSize: '0.85rem' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Terms and Conditions Checkbox */}
                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input border-secondary-subtle"
                        id="terms"
                        checked={termsAccepted}
                        onChange={(e) => handleInputChange('terms', e.target.checked, setTermsAccepted)}
                        onBlur={() => handleBlur('terms')}
                        style={{ cursor: 'pointer', width: '1.1em', height: '1.1em' }}
                      />
                      <label className="form-check-label text-muted small ms-1" htmlFor="terms" style={{ cursor: 'pointer', userSelect: 'none' }}>
                        I agree to the <a href="#terms" className="text-decoration-none fw-semibold text-primary">Terms & Conditions</a> and <a href="#privacy" className="text-decoration-none fw-semibold text-primary">Privacy Policy</a>
                      </label>
                    </div>
                    {errors.terms && touched.terms && (
                      <div className="text-danger small mt-1 d-flex align-items-center">
                        <FiAlertCircle className="me-1" size={14} /> {errors.terms}
                      </div>
                    )}
                  </div>

                  {/* Register Button */}
                  <button
                    type="submit"
                    className="btn btn-premium-primary w-100 py-3 d-flex justify-content-center align-items-center btn-ripple hover-scale"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <FiChevronRight className="ms-1" size={20} />
                      </>
                    )}
                  </button>
                </form>

                {/* Link to Login */}
                <div className="text-center mt-4">
                  <p className="text-muted mb-0 small">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none fw-semibold text-primary">
                      Login
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
