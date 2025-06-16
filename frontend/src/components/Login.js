import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      const response = await fetch('http://localhost/Promptos/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const result = await response.json();
      if (result.success) {
        setSuccess('Login successful! Redirecting...');
        setIsAuthenticated(true);
        setTimeout(() => navigate('/dashboard'), 2000);
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
    <div className="login-page">
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
            <a href="/register" className="nav-link">Need an account?</a>
          </div>
        </div>
      </nav>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">🎯</div>
            <h2 className="login-title">Welcome Back!</h2>
            <p className="login-subtitle">
              Sign in to access your website builder dashboard and continue creating amazing websites
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

          <form className="login-form" onSubmit={handleSubmit}>
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
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="input-field"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span className="checkmark"></span>
                <span>Remember me</span>
              </label>
              <a href="/forgot-password" className="forgot-password">
                Forgot password?
              </a>
            </div>

            <button 
              type="submit" 
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span className="btn-icon">🚀</span>
                  <span>Sign In</span>
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="login-divider">
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

          <p className="login-register">
            Don't have an account? 
            <a href="/register" className="register-link">
              <span>Sign up for free</span>
              <span className="link-arrow">→</span>
            </a>
          </p>

          <div className="login-stats">
            <div className="stat-item">
              <span className="stat-number">500K+</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Uptime</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
