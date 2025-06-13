import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');

  const handleSendOtp = async () => {
    try {
      await axios.post('http://localhost:8086/api/v1/auth/forgot-password', { email });
      setMessage('OTP sent to your email!');
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data || 'Failed to send OTP');
    }
  };

  const handleResetPassword = async () => {
    try {
      await axios.post('http://localhost:8086/api/v1/auth/reset-password', {
        email,
        otp,
        newPassword,
      });
      setMessage('Password reset successful!');
      setStep(1);
      setEmail('');
      setOtp('');
      setNewPassword('');
    } catch (err) {
      setMessage(err.response?.data || 'Failed to reset password');
    }
  };

  return (
    <div className="forgot-password-container">
      {step === 1 ? (
        <>
          <h2>Forgot Password</h2>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button onClick={handleSendOtp}>Send OTP</button>
        </>
      ) : (
        <>
          <h2>Reset Password</h2>
          <label>OTP</label>
          <input
            type="text"
            placeholder="Enter OTP sent to your email"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button onClick={handleResetPassword}>Reset Password</button>
        </>
      )}
      {message && <p className="info-message">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
