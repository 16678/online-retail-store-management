import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminManagement.css';

const AdminManagement = () => {
  const [admin, setAdmin] = useState({
    adminFullName: '',
    adminEmail: '',
    adminPassword: '',
  });

  const [message, setMessage] = useState('');
  const [admins, setAdmins] = useState([]);
  const [isEdit, setIsEdit] = useState(false); // to toggle edit mode
  const [currentAdminId, setCurrentAdminId] = useState(null);

  useEffect(() => {
    // Fetch all admins when the component mounts
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('http://localhost:8086/api/admin/all');
      setAdmins(response.data);
    } catch (error) {
      console.error('There was an error fetching admins:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prevAdmin) => ({
      ...prevAdmin,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      // Update existing admin
      try {
        const response = await axios.put(`http://localhost:8086/api/admin/update/${currentAdminId}`, admin);
        setMessage('Admin updated successfully!');
        setIsEdit(false);
        setAdmin({
          adminFullName: '',
          adminEmail: '',
          adminPassword: '',
        });
        fetchAdmins(); // Refresh the admin list
      } catch (error) {
        setMessage(error.response?.data || 'Something went wrong!');
      }
    } else {
      // Add new admin
      try {
        const response = await axios.post('http://localhost:8086/api/admin/add', admin);
        setMessage('Admin added successfully!');
        setAdmin({
          adminFullName: '',
          adminEmail: '',
          adminPassword: '',
        });
        fetchAdmins(); // Refresh the admin list
      } catch (error) {
        setMessage(error.response?.data || 'Something went wrong!');
      }
    }
  };

  const handleEdit = (adminId) => {
    // Find the admin to edit from the list
    const adminToEdit = admins.find((admin) => admin.id === adminId);
    setAdmin({
      adminFullName: adminToEdit.adminFullName,
      adminEmail: adminToEdit.adminEmail,
      adminPassword: adminToEdit.adminPassword,
    });
    setIsEdit(true);
    setCurrentAdminId(adminId); // Save the admin ID for updating
  };

  return (
    <div className="admin-management-container">
      {/* Login Container */}
      <div className="login-container">
        <h2>Login</h2>
        {/* Login form (you can implement this as per your requirements) */}
        <form>
          <div className="input-field">
            <label htmlFor="loginEmail">Email:</label>
            <input type="email" id="loginEmail" placeholder="Enter email" />
          </div>
          <div className="input-field">
            <label htmlFor="loginPassword">Password:</label>
            <input type="password" id="loginPassword" placeholder="Enter password" />
          </div>
          <button type="submit" className="submit-button">Login</button>
        </form>
      </div>

      {/* Admin Content Container */}
      <div className="admin-content-container">
        <h2>{isEdit ? 'Edit Admin' : 'Add New Admin'}</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="input-field">
            <label htmlFor="adminFullName">Full Name:</label>
            <input
              type="text"
              name="adminFullName"
              value={admin.adminFullName}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="input-field">
            <label htmlFor="adminEmail">Email:</label>
            <input
              type="email"
              name="adminEmail"
              value={admin.adminEmail}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="input-field">
            <label htmlFor="adminPassword">Password:</label>
            <input
              type="password"
              name="adminPassword"
              value={admin.adminPassword}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="submit-button">
            {isEdit ? 'Update Admin' : 'Add Admin'}
          </button>
        </form>

        {message && <p className="message">{message}</p>}

        <div className="admin-list">
          <h3>All Admins</h3>
          <ul>
            {admins.map((admin) => (
              <li key={admin.id} className="admin-item">
                <p><strong>Name:</strong> {admin.adminFullName}</p>
                <p><strong>Email:</strong> {admin.adminEmail}</p>
                {/* You may choose not to display the password for security reasons */}
                <button onClick={() => handleEdit(admin.id)} className="edit-button">
                  Edit
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
