import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost/Promptos/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const result = await response.json();
      if (result.success) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-waves"></div>
        <div className="floating-shapes"></div>
        <div className="color-bubbles"></div>
      </div>

      {/* Navigation */}
      <nav className="auth-navbar">
        <div className="nav-container">
          <div className="nav-logo" onClick={() => navigate('/')}>
            <div className="logo-icon">🚀</div>
            <span className="logo-text">Sirjan Ai</span>
          </div>
          <div className="nav-links">
            <a href="/login" className="nav-link">Already have an account?</a>
          </div>
        </div>
      </nav>

      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <div className="register-icon">✨</div>
            <h2 className="register-title">Create Your Account</h2>
            <p className="register-subtitle">
              Join 500,000+ creators building amazing websites with Sirjan Ai
            </p>
          </div>

          {error && (
            <div className="message error-message">
              <span className="message-icon">❌</span>
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="message success-message">
              <span className="message-icon">✅</span>
              <span>{success}</span>
            </div>
          )}

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  className="input-field"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">@</span>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="input-field"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="input-field"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="input-field"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">📱</span>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  className="input-field"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className={`register-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span className="btn-icon">🚀</span>
                  <span>Create Account</span>
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="register-divider">
            <span>or</span>
          </div>

          <div className="social-login">
            <button className="social-btn google">
              <span className="social-icon">🔍</span>
              <span>Continue with Google</span>
            </button>
            <button className="social-btn github">
              <span className="social-icon">🐙</span>
              <span>Continue with GitHub</span>
            </button>
          </div>

          <p className="register-login">
            Already have an account? 
            <a href="/login" className="login-link">
              <span>Log in</span>
              <span className="link-arrow">→</span>
            </a>
          </p>

          <div className="register-features">
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <span>Free forever plan</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <span>No credit card required</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✅</span>
              <span>Start building immediately</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
