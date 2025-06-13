import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeliveryBoyLogIn.css';

function DeliveryBoyLogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8086/api/deliveryboy/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Save deliveryBoyId to localStorage
        localStorage.setItem('deliveryBoyId', data.id);

        setMessage('Login successful!');
        setIsSuccess(true);

        setTimeout(() => {
          // Navigate to dashboard with deliveryBoyId in state
          navigate('/Delivery/Dashboard', { state: { deliveryBoyId: data.id } });
        }, 1000);
      } else {
        const error = await response.text();
        setMessage(error);
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('Network error. Please try again later.');
      setIsSuccess(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Delivery Boy Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {message && (
        <p style={{ color: isSuccess ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default DeliveryBoyLogIn;
