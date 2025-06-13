import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [popup, setPopup] = useState({ message: '', type: '' });

  const navigate = useNavigate();

  // Popup display function
  const showPopup = (message, type = 'success') => {
    setPopup({ message, type });
    setTimeout(() => setPopup({ message: '', type: '' }), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8086/api/v1/auth/login',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("Login response:", response.data);

      // Handle nested or direct response
      const customer = response.data.customer || response.data;

      if (!customer.customerId) {
        throw new Error("Login response does not contain valid customerId");
      }

      // Save in localStorage
      localStorage.setItem('customer', JSON.stringify(customer));
      localStorage.setItem('customerId', customer.customerId);

      showPopup(`🎉 Login successful! Welcome, ${customer.customerName || 'User'}! ❤️`, 'success');

      navigate('/'); // Redirect to homepage

    } catch (error) {
      const errorMsg =
        error.response?.data?.message || error.message || 'Login failed. Please try again.';
      showPopup(errorMsg, 'error');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>

      {popup.message && (
        <div className={`popup-message popup-${popup.type}`}>
          {popup.message}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label className="form-label">
            Email <span className="required-star">*</span>
          </label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Password <span className="required-star">*</span>
          </label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>

        <div className="forgot-password-link">
          <Link to="/ForgotPassword">Forgot Password?</Link>
        </div>

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
