import React, { useState } from 'react';
import axios from 'axios';
import './AddAdmin.css';

const AddAdmin = () => {
  const [adminDetails, setAdminDetails] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setError('');
    setSuccess('');

    try {
      // Send data to backend via Axios
      const response = await axios.post('/api/admin/add', adminDetails, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Assuming the backend returns a success message on successful admin addition
      setSuccess(response.data || 'Admin added successfully!');
      
      // Reset form fields after success
      setAdminDetails({
        fullName: '',
        email: '',
        password: '',
      });
    } catch (error) {
      // Handling errors
      if (error.response) {
        // Server responded with an error status code
        setError(error.response.data || 'Error adding admin');
      } else {
        // No response from server (network error, timeout, etc.)
        setError('Network error, please try again.');
      }
    }
  };

  return (
    <div className="add-admin-container">
      <h2>Add Admin</h2>
      <form className="add-admin-form" onSubmit={handleSubmit}>
        <label>
          Full Name:
          <input
            type="text"
            name="fullName"
            value={adminDetails.fullName}
            onChange={handleInputChange}
            placeholder="Enter full name"
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={adminDetails.email}
            onChange={handleInputChange}
            placeholder="Enter email"
            required
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            name="password"
            value={adminDetails.password}
            onChange={handleInputChange}
            placeholder="Enter password"
            required
          />
        </label>

        <button type="submit">Add Admin</button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default AddAdmin;
