import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiLinkedin, FiInstagram, FiMail, FiPhone, FiMapPin, FiActivity } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer bg-white border-top mt-auto pt-5 pb-4" style={{ borderColor: 'var(--border-color)' }}>
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Column 1: About EduBridge */}
          <div className="col-lg-4 col-md-6">
            <Link className="d-flex align-items-center mb-3 text-gradient-primary fw-bold fs-4 text-decoration-none" to="/">
              <FiActivity className="me-2 text-primary" size={24} />
              <span>EduBridge</span>
            </Link>
            <p className="text-muted small mb-4" style={{ lineHeight: '1.6' }}>
              EduBridge is an intelligent talent-readiness platform designed to bridge the gap between students and industry. We offer skill-gap diagnostics, custom courses, direct developer mentorship, and automated placement matching.
            </p>
            <div className="d-flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-muted hover-scale" style={{ transition: 'color 0.2s' }} aria-label="Facebook">
                <FiFacebook size={20} className="hover-primary" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-muted hover-scale" style={{ transition: 'color 0.2s' }} aria-label="Twitter">
                <FiTwitter size={20} className="hover-primary" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-muted hover-scale" style={{ transition: 'color 0.2s' }} aria-label="LinkedIn">
                <FiLinkedin size={20} className="hover-primary" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-muted hover-scale" style={{ transition: 'color 0.2s' }} aria-label="Instagram">
                <FiInstagram size={20} className="hover-primary" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-lg-2 col-md-6 ms-lg-auto">
            <h6 className="fw-bold mb-3 text-dark">Quick Links</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <Link to="/" className="text-muted text-decoration-none small hover-link-style">Home</Link>
              </li>
              <li className="mb-2">
                <a href="#courses" className="text-muted text-decoration-none small hover-link-style">Courses</a>
              </li>
              <li className="mb-2">
                <a href="#about" className="text-muted text-decoration-none small hover-link-style">About Us</a>
              </li>
              <li className="mb-2">
                <a href="#contact" className="text-muted text-decoration-none small hover-link-style">Contact</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Policies */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold mb-3 text-dark">Legal</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <a href="#privacy" className="text-muted text-decoration-none small hover-link-style">Privacy Policy</a>
              </li>
              <li className="mb-2">
                <a href="#terms" className="text-muted text-decoration-none small hover-link-style">Terms of Service</a>
              </li>
              <li className="mb-2">
                <a href="#cookies" className="text-muted text-decoration-none small hover-link-style">Cookie Policy</a>
              </li>
              <li className="mb-2">
                <a href="#support" className="text-muted text-decoration-none small hover-link-style">Support Desk</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3 text-dark">Contact Us</h6>
            <ul className="list-unstyled mb-0">
              <li className="d-flex align-items-start mb-3">
                <FiMapPin className="text-primary me-2 mt-1 flex-shrink-0" size={16} />
                <span className="text-muted small">100 Shivaji Nagar Way, Tech District, Maharashtra , INDIA </span>
              </li>
              <li className="d-flex align-items-center mb-3">
                <FiPhone className="text-primary me-2 flex-shrink-0" size={16} />
                <span className="text-muted small">+91 8605830988</span>
              </li>
              <li className="d-flex align-items-center">
                <FiMail className="text-primary me-2 flex-shrink-0" size={16} />
                <span className="text-muted small">support@edubridge.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4" style={{ borderColor: 'var(--border-color)' }} />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <span className="text-muted small">
              &copy; {currentYear} <strong className="text-gradient-primary">EduBridge</strong>. All rights reserved.
            </span>
          </div>
          <div className="col-md-6 text-center text-md-end mt-2 mt-md-0">
            <span className="text-muted small">
              Designed for career growth & industry alignment.
            </span>
          </div>
        </div>
      </div>

      {/* Embedded CSS for hover styles in Footer */}
      <style>{`
        .hover-primary:hover {
          color: var(--primary) !important;
        }
        .hover-link-style {
          transition: color 0.2s, padding-left 0.2s;
        }
        .hover-link-style:hover {
          color: var(--primary) !important;
          padding-left: 4px;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
