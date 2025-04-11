import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import React Router's useNavigate
import "./AdminLogin.css"; // Optional: Add CSS styling for the login page

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleLogin = (e) => {
    e.preventDefault();

    const adminCredentials = {
      email,
      password,
    };

    axios
      .post("http://localhost:8086/api/admin/login", adminCredentials) // Replace with your backend endpoint
      .then((response) => {
        if (response.status === 200) {
          alert("Login successful!");
          navigate("/admin"); // Navigate to admin dashboard route
        }
      })
      .catch((error) => {
        setErrorMessage("Invalid email or password. Please try again.");
        console.error("Login error:", error);
      });
  };

  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
      <form className="admin-login-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
