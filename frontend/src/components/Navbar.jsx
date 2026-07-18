import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiLogOut, FiBriefcase, FiAward, FiBookOpen, FiUser, FiActivity } from 'react-icons/fi';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-premium sticky-top py-3">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-3 text-gradient-primary d-flex align-items-center" to="/" aria-label="EduBridge Home">
          <FiActivity className="me-2 text-primary" size={28} />
          <span>EduBridge</span>
        </Link>
        
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Main Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/') ? 'active fw-semibold text-primary' : ''}`} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#courses">
                Courses
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#about">
                About
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#contact">
                Contact
              </a>
            </li>
          </ul>

          {/* Auth / Profile Links */}
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            {user ? (
              <>
                {user.role === 'STUDENT' && (
                  <li className="nav-item">
                    <Link className={`nav-link d-flex align-items-center me-2 ${isActive('/student-dashboard') ? 'active fw-semibold' : ''}`} to="/student-dashboard">
                      <FiAward className="me-1" /> Student Panel
                    </Link>
                  </li>
                )}
                {user.role === 'MENTOR' && (
                  <li className="nav-item">
                    <Link className={`nav-link d-flex align-items-center me-2 ${isActive('/mentor-dashboard') ? 'active fw-semibold' : ''}`} to="/mentor-dashboard">
                      <FiBookOpen className="me-1" /> Mentor Panel
                    </Link>
                  </li>
                )}
                {user.role === 'RECRUITER' && (
                  <li className="nav-item">
                    <Link className={`nav-link d-flex align-items-center me-2 ${isActive('/recruiter-dashboard') ? 'active fw-semibold' : ''}`} to="/recruiter-dashboard">
                      <FiBriefcase className="me-1" /> Recruiter Panel
                    </Link>
                  </li>
                )}
                {user.role === 'ADMIN' && (
                  <li className="nav-item">
                    <Link className={`nav-link d-flex align-items-center me-2 ${isActive('/admin-dashboard') ? 'active fw-semibold' : ''}`} to="/admin-dashboard">
                      <FiUser className="me-1" /> Admin Panel
                    </Link>
                  </li>
                )}
                <li className="nav-item me-2 d-none d-lg-block">
                  <span className="badge badge-premium">{user.email}</span>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-premium-secondary py-2 px-3 d-flex align-items-center hover-scale">
                    <FiLogOut className="me-2" /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn btn-premium-outline py-2 px-4 me-2 hover-scale" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-premium-primary py-2 px-4 hover-scale" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
