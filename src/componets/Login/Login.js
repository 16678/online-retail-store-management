import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8086/api/v1/auth/login', {
        email,
        password
      });

      setMessage(`Login successful! Welcome, ${response.data.customerName}`);
      
      // You can store token or user info if needed
      // localStorage.setItem('token', response.data.token);

      // Redirect to home page after successful login
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      setMessage(error.response?.data || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>

      {message && (
        <p className={`login-message ${message.includes('successful') ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Login;
