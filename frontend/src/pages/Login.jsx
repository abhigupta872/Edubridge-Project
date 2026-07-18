import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { FiMail, FiLock, FiAlertCircle, FiArrowRight, FiEye, FiEyeOff, FiActivity } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation and UI states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      redirectUser(user.role);
    }
  }, []);

  const redirectUser = (role) => {
    switch (role) {
      case 'STUDENT':
        navigate('/student-dashboard');
        break;
      case 'MENTOR':
        navigate('/mentor-dashboard');
        break;
      case 'RECRUITER':
        navigate('/recruiter-dashboard');
        break;
      case 'ADMIN':
        navigate('/admin-dashboard');
        break;
      default:
        break;
    }
  };

  // Real-time validation
  const validateField = (name, value) => {
    let error = '';
    if (name === 'email') {
      if (!value) {
        error = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'Please enter a valid email address.';
      }
    } else if (name === 'password') {
      if (!value) {
        error = 'Password is required.';
      }
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'email') validateField('email', email);
    if (field === 'password') validateField('password', password);
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (touched.email) {
      validateField('email', val);
    }
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    if (touched.password) {
      validateField('password', val);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setApiError('');
    
    // Mark all as touched and validate
    setTouched({ email: true, password: true });
    validateField('email', email);
    validateField('password', password);

    // If there are validation errors, block submission
    if (!email || !password || errors.email || errors.password) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      
      // If remember me is checked, we can save email or handling in localStorage
      if (rememberMe) {
        localStorage.setItem('remembered_email', email);
      } else {
        localStorage.removeItem('remembered_email');
      }

      localStorage.setItem('user', JSON.stringify(response.data));
      redirectUser(response.data.role);
    } catch (err) {
      setApiError(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Autofill email if remembered
  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center animate-fade-in" style={{ minHeight: '80vh' }}>
      <div className="card glass-card p-4 p-md-5 w-100 animate-slide-up" style={{ maxWidth: '500px', borderRadius: '16px' }}>
        
        {/* Logo and Brand */}
        <div className="text-center mb-4">
          <Link className="d-inline-flex align-items-center mb-3 text-gradient-primary fw-bold fs-2 text-decoration-none" to="/">
            <FiActivity className="me-2 text-primary" size={32} />
            <span>EduBridge</span>
          </Link>
          <h2 className="fw-bold text-dark mt-2 mb-1">Welcome Back!</h2>
          <p className="text-muted">Continue your learning journey.</p>
        </div>

        {/* Global API Error Alert */}
        {apiError && (
          <div className="alert alert-danger d-flex align-items-center border-0 py-3 px-3 mb-4 animate-fade-in" role="alert" style={{ background: 'rgba(239, 68, 68, 0.08)', color: 'var(--danger)', borderRadius: '12px' }}>
            <FiAlertCircle className="me-2 flex-shrink-0" size={20} />
            <div className="small fw-medium">{apiError}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} noValidate>
          {/* Email Input */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-dark fw-medium small mb-2">Email Address</label>
            <div className="input-group position-relative">
              <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: errors.email && touched.email ? 'var(--danger)' : 'var(--border-color)' }}>
                <FiMail />
              </span>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-control form-premium border-start-0 ${errors.email && touched.email ? 'is-invalid border-danger' : ''}`}
                placeholder="name@example.com"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => handleBlur('email')}
                aria-invalid={errors.email && touched.email ? "true" : "false"}
                aria-describedby={errors.email && touched.email ? "email-error" : undefined}
                required
              />
            </div>
            {errors.email && touched.email && (
              <div id="email-error" className="text-danger small mt-1 d-flex align-items-center animate-fade-in">
                <FiAlertCircle className="me-1" size={14} /> {errors.email}
              </div>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label htmlFor="password" className="form-label text-dark fw-medium small mb-0">Password</label>
              <a href="#forgot" className="text-decoration-none small fw-semibold text-primary" style={{ fontSize: '0.85rem' }}>
                Forgot Password?
              </a>
            </div>
            <div className="input-group position-relative">
              <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: errors.password && touched.password ? 'var(--danger)' : 'var(--border-color)' }}>
                <FiLock />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={`form-control form-premium border-start-0 ${errors.password && touched.password ? 'is-invalid border-danger' : ''}`}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => handleBlur('password')}
                aria-invalid={errors.password && touched.password ? "true" : "false"}
                aria-describedby={errors.password && touched.password ? "password-error" : undefined}
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
              <div id="password-error" className="text-danger small mt-1 d-flex align-items-center animate-fade-in">
                <FiAlertCircle className="me-1" size={14} /> {errors.password}
              </div>
            )}
          </div>

          {/* Remember Me Checkbox */}
          <div className="mb-4 d-flex align-items-center">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input border-secondary-subtle"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ cursor: 'pointer', width: '1.1em', height: '1.1em' }}
              />
              <label className="form-check-label text-muted small ms-1" htmlFor="rememberMe" style={{ cursor: 'pointer', userSelect: 'none' }}>
                Remember Me
              </label>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn btn-premium-primary w-100 py-3 d-flex justify-content-center align-items-center btn-ripple hover-scale"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <FiArrowRight className="ms-2" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="d-flex align-items-center my-4">
          <hr className="flex-grow-1 text-muted-opacity" style={{ borderColor: 'var(--border-color)' }} />
          <span className="mx-3 text-muted small fw-bold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>OR</span>
          <hr className="flex-grow-1 text-muted-opacity" style={{ borderColor: 'var(--border-color)' }} />
        </div>

        {/* Google Login (UI Only) */}
        <button
          type="button"
          className="btn btn-google w-100 py-3 d-flex align-items-center justify-content-center gap-2 mb-4 hover-scale"
          onClick={() => alert('Google Sign-In is for demonstration only.')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Sign in with Google</span>
        </button>

        {/* Link to Register */}
        <div className="text-center">
          <p className="text-muted mb-0 small">
            Don't have an account?{' '}
            <Link to="/register" className="text-decoration-none fw-semibold text-primary">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
